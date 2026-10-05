#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "include/model.h"
#include "include/constants.h"
#include "include/heap.h"
#include "include/list.h"
#include "include/hash_table.h"
#include "include/queue.h"
#include "include/seating.h"
#include "include/orders.h"
#include "include/kitchen.h"
#include "include/dag.h"
#include "include/simulator.h"
#include "include/metrics.h"

static void clear_input_buffer(void)
{
    int c;
    while ((c = getchar()) != '\n' && c != EOF)
        ;
}

static int read_int(const char *prompt, int *val)
{
    printf("%s", prompt);
    if (scanf("%d", val) != 1)
    {
        clear_input_buffer();
        return 0;
    }
    clear_input_buffer();
    return 1;
}

static void print_menu(void)
{
    printf("\n=======================================================\n");
    printf("         RESTAURANT MANAGEMENT SYSTEM (DSA)            \n");
    printf("=======================================================\n");
    printf(" 1. Show restaurant tables\n");
    printf(" 2. Add customer to waiting queue\n");
    printf(" 3. Show waiting queue (Priority Tracker)\n");
    printf(" 4. Seat next customer (Min-Heap / Combining)\n");
    printf(" 5. Create order\n");
    printf(" 6. Update order status\n");
    printf(" 7. Show active orders (Linked List)\n");
    printf(" 8. Show kitchen status\n");
    printf(" 9. Show workflow / ETA (DAG & Topological Sort)\n");
    printf("10. Run full simulation cycle\n");
    printf("11. Show system metrics & performance\n");
    printf(" 0. Exit\n");
    printf("=======================================================\n");
}

int main(int argc, char *argv[])
{
    SeatingManager sm;
    seating_init(&sm);
    /* Set up initial tables of various capacities */
    seating_add_table(&sm, 1, 2);
    seating_add_table(&sm, 2, 2);
    seating_add_table(&sm, 3, 4);
    seating_add_table(&sm, 4, 4);
    seating_add_table(&sm, 5, 6);
    seating_add_table(&sm, 6, 8);

    /* CLI JSON bridge for frontend integration */
    if (argc > 1)
    {
        if (strcmp(argv[1], "--seat") == 0 && argc >= 4)
        {
            int group_size = atoi(argv[2]);
            int cust_id = atoi(argv[3]);
            if (argc >= 5 && strlen(argv[4]) > 0)
            {
                char buf[64];
                strncpy(buf, argv[4], sizeof(buf) - 1);
                buf[sizeof(buf) - 1] = '\0';
                char *token = strtok(buf, ",");
                while (token != NULL)
                {
                    int tid = atoi(token);
                    if (tid > 0) seating_occupy_table(&sm, tid);
                    token = strtok(NULL, ",");
                }
            }

            Table *fit = seating_find_best_fit(&sm, group_size);
            if (fit != NULL)
            {
                printf("{\"status\":\"success\",\"type\":\"single\",\"table1_id\":%d,\"table1_cap\":%d,\"table2_id\":0,\"table2_cap\":0,\"total_cap\":%d,\"waste\":%d,\"customer_id\":%d,\"group_size\":%d}\n",
                       fit->id, fit->capacity, fit->capacity, fit->capacity - group_size, cust_id, group_size);
                return 0;
            }

            Table *t1 = NULL;
            Table *t2 = NULL;
            if (seating_find_adjacent_combination(&sm, group_size, &t1, &t2))
            {
                int combined = t1->capacity + t2->capacity;
                printf("{\"status\":\"success\",\"type\":\"combined\",\"table1_id\":%d,\"table1_cap\":%d,\"table2_id\":%d,\"table2_cap\":%d,\"total_cap\":%d,\"waste\":%d,\"customer_id\":%d,\"group_size\":%d}\n",
                       t1->id, t1->capacity, t2->id, t2->capacity, combined, combined - group_size, cust_id, group_size);
                return 0;
            }

            printf("{\"status\":\"failed\",\"message\":\"No suitable table or combination available\",\"customer_id\":%d,\"group_size\":%d}\n",
                   cust_id, group_size);
            return 0;
        }
    }

    PriorityQueue *pq = queue_create(MAX_CUSTOMERS);
    OrderManager *om = order_manager_create();

    KitchenManager km;
    kitchen_init(&km);

    DAG dag;
    dag_create_default_workflow(&dag);

    RestaurantMetrics metrics;
    metrics_init(&metrics);

    int running = 1;
    while (running)
    {
        print_menu();
        int choice = -1;
        if (!read_int("Enter your choice: ", &choice))
        {
            printf("Invalid input. Please enter a valid number.\n");
            continue;
        }

        switch (choice)
        {
        case 1:
            seating_display_layout(&sm);
            break;

        case 2:
        {
            int cust_id = 0, size = 0, priority = 0;
            if (!read_int("Enter Customer ID: ", &cust_id) || cust_id <= 0)
            {
                printf("Error: Customer ID must be a positive integer.\n");
                break;
            }
            if (!read_int("Enter Group Size: ", &size) || size <= 0)
            {
                printf("Error: Group size must be greater than 0.\n");
                break;
            }
            if (!read_int("Enter Priority (1: Normal, 2: VIP, 3: Urgent): ", &priority) || priority <= 0)
            {
                printf("Error: Priority must be positive.\n");
                break;
            }

            Customer *c = malloc(sizeof(Customer));
            if (c == NULL)
            {
                printf("Error: Memory allocation failed.\n");
                break;
            }
            c->id = cust_id;
            c->group_size = size;
            c->priority = priority;

            if (queue_enqueue(pq, c))
            {
                int pos = queue_get_position(pq, c->id);
                int wait_time = queue_estimated_wait_time(pos);
                metrics_record_arrival(&metrics, wait_time);
                printf("\nCustomer #%d added to priority waiting queue!\n", c->id);
                printf("Position in queue: %d | Estimated wait: %d mins\n", pos, wait_time);
            }
            else
            {
                printf("Error: Failed to enqueue customer.\n");
                free(c);
            }
            break;
        }

        case 3:
            queue_print(pq);
            break;

        case 4:
        {
            if (queue_is_empty(pq))
            {
                printf("Waiting queue is currently empty. No customers to seat.\n");
                break;
            }

            Customer *top = queue_peek(pq);
            printf("Attempting to seat Customer #%d (Group: %d, Priority: %d)...\n",
                   top->id, top->group_size, top->priority);

            /* Min-heap Best-fit table matching */
            Table *fit = seating_find_best_fit(&sm, top->group_size);
            if (fit != NULL)
            {
                queue_dequeue(pq);
                seating_occupy_table(&sm, fit->id);
                metrics_record_seated(&metrics);
                printf("Success: Customer #%d seated at Table %d (Capacity: %d).\n",
                       top->id, fit->id, fit->capacity);
                free(top);
            }
            else
            {
                /* Check adjacent table combination */
                Table *t1 = NULL;
                Table *t2 = NULL;
                if (seating_find_adjacent_combination(&sm, top->group_size, &t1, &t2))
                {
                    queue_dequeue(pq);
                    seating_occupy_table(&sm, t1->id);
                    seating_occupy_table(&sm, t2->id);
                    metrics_record_seated(&metrics);
                    printf("Success: Customer #%d seated across combined adjacent Tables %d and %d (Combined Capacity: %d).\n",
                           top->id, t1->id, t2->id, t1->capacity + t2->capacity);
                    free(top);
                }
                else
                {
                    printf("Notice: No suitable table or combination available right now for group size %d.\n",
                           top->group_size);
                }
            }
            break;
        }

        case 5:
        {
            int ord_id = 0, cust_id = 0, tbl_id = 0, prio = 0;
            if (!read_int("Enter Order ID: ", &ord_id) || ord_id <= 0)
            {
                printf("Error: Order ID must be positive.\n");
                break;
            }
            if (!read_int("Enter Customer ID: ", &cust_id) || cust_id <= 0)
            {
                printf("Error: Customer ID must be positive.\n");
                break;
            }
            if (!read_int("Enter Table ID (0 for Takeaway/Delivery): ", &tbl_id) || tbl_id < 0)
            {
                printf("Error: Invalid Table ID.\n");
                break;
            }
            printf("Select Order Type / Priority:\n");
            printf("  1. Delivery\n  2. Takeaway\n  3. Dine-In\n");
            if (!read_int("Choice (1-3): ", &prio) || prio < 1 || prio > 3)
            {
                printf("Error: Invalid order priority choice.\n");
                break;
            }

            Order *new_order = order_create(om, ord_id, cust_id, tbl_id, prio);
            if (new_order != NULL)
            {
                metrics_record_order_placed(&metrics);
                printf("Order #%d created successfully!\n", new_order->id);
                printf("Type: %s | Status: %s\n",
                       order_priority_str(new_order->priority),
                       order_status_str(new_order->status));
            }
            else
            {
                printf("Error: Failed to create order (Order ID may already exist).\n");
            }
            break;
        }

        case 6:
        {
            int ord_id = 0, new_st = 0;
            if (!read_int("Enter Order ID to update: ", &ord_id))
            {
                printf("Error: Invalid Order ID.\n");
                break;
            }
            Order *ord = order_find(om, ord_id);
            if (ord == NULL)
            {
                printf("Error: Order #%d not found in hash table lookup.\n", ord_id);
                break;
            }

            printf("Current Status: %s\n", order_status_str(ord->status));
            printf("Select New Status:\n");
            printf("  0. Placed\n  1. Preparing\n  2. Served\n  3. Completed\n  4. Cancelled\n");
            if (!read_int("Choice (0-4): ", &new_st) || new_st < 0 || new_st > 4)
            {
                printf("Error: Invalid status option.\n");
                break;
            }

            if (new_st == ORDER_STATUS_COMPLETED)
            {
                order_complete(om, ord_id);
                metrics_record_order_completed(&metrics);
                printf("Order #%d marked as Completed and removed from active list.\n", ord_id);
            }
            else
            {
                order_update_status(om, ord_id, new_st);
                printf("Order #%d status updated to: %s\n", ord_id, order_status_str(new_st));
            }
            break;
        }

        case 7:
            order_display_active(om);
            break;

        case 8:
            kitchen_display_status(&km);
            break;

        case 9:
            dag_display_workflow(&dag);
            break;

        case 10:
            simulator_run_cycle(&sm, pq, om, &km, &dag, &metrics);
            break;

        case 11:
        {
            size_t occupied = 0;
            for (size_t i = 0; i < sm.count; i++)
            {
                if (sm.tables[i].occupied)
                {
                    occupied++;
                }
            }
            metrics_display(&metrics, occupied, sm.count);
            break;
        }

        case 0:
            printf("Exiting Restaurant Management System. Goodbye!\n");
            running = 0;
            break;

        default:
            printf("Invalid selection. Please choose an option from 0 to 11.\n");
            break;
        }
    }

    /* Cleanup remaining dynamically allocated customers */
    while (!queue_is_empty(pq))
    {
        Customer *c = queue_dequeue(pq);
        free(c);
    }
    queue_destroy(pq);
    order_manager_destroy(om);

    return 0;
}