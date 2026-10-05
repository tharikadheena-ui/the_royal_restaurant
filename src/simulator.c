#include "../include/simulator.h"

#include <stdio.h>
#include <stdlib.h>

void simulator_run_cycle(SeatingManager *sm,
                         PriorityQueue *pq,
                         OrderManager *om,
                         KitchenManager *km,
                         const DAG *dag,
                         RestaurantMetrics *metrics)
{
    printf("\n===============================================================\n");
    printf("              STARTING RESTAURANT SIMULATION CYCLE             \n");
    printf("===============================================================\n");

    /* Step 1: Simulated customer arrivals */
    printf("\n>>> [1/5] Customers Arriving & Priority Queue Insertion\n");
    Customer customers[3] = {
        {.id = 201, .group_size = 2, .priority = 1}, /* Regular group */
        {.id = 202, .group_size = 4, .priority = 3}, /* VIP group */
        {.id = 203, .group_size = 6, .priority = 2}  /* Family group */
    };

    for (int i = 0; i < 3; i++)
    {
        queue_enqueue(pq, &customers[i]);
        int pos = queue_get_position(pq, customers[i].id);
        int est_wait = queue_estimated_wait_time(pos);
        metrics_record_arrival(metrics, est_wait);
        printf("Customer #%d (Group: %d, Priority: %d) entered queue.\n",
               customers[i].id, customers[i].group_size, customers[i].priority);
    }

    queue_print(pq);

    /* Step 2: Seating next customer using Best-Fit Min-Heap / Table Combining */
    printf(">>> [2/5] Table Allocation via Min-Heap Best-Fit Matching\n");
    int seated_tables[3] = {0};
    int num_seated = 0;

    while (!queue_is_empty(pq))
    {
        Customer *next_cust = queue_dequeue(pq);
        if (next_cust == NULL)
        {
            break;
        }

        printf("Processing Customer #%d (Group size: %d, Priority: %d)...\n",
               next_cust->id, next_cust->group_size, next_cust->priority);

        Table *table = seating_find_best_fit(sm, next_cust->group_size);
        if (table != NULL)
        {
            seating_occupy_table(sm, table->id);
            seated_tables[num_seated++] = table->id;
            metrics_record_seated(metrics);
            printf("  -> Best-Fit Success: Seated at Table %d (Capacity: %d)\n",
                   table->id, table->capacity);

            /* Create order for this seated customer */
            int order_id = 500 + next_cust->id;
            Order *ord = order_create(om, order_id, next_cust->id, table->id, ORDER_PRIORITY_DINE_IN);
            if (ord != NULL)
            {
                metrics_record_order_placed(metrics);
                printf("  -> Created Order #%d (Type: %s, Status: %s)\n",
                       ord->id, order_priority_str(ord->priority), order_status_str(ord->status));
            }
        }
        else
        {
            /* Attempt adjacent table combination */
            Table *t1 = NULL;
            Table *t2 = NULL;
            if (seating_find_adjacent_combination(sm, next_cust->group_size, &t1, &t2))
            {
                seating_occupy_table(sm, t1->id);
                seating_occupy_table(sm, t2->id);
                seated_tables[num_seated++] = t1->id;
                seated_tables[num_seated++] = t2->id;
                metrics_record_seated(metrics);
                printf("  -> Combined Tables Success: Seated at adjacent Tables %d + %d (Combined Capacity: %d)\n",
                       t1->id, t2->id, t1->capacity + t2->capacity);

                int order_id = 500 + next_cust->id;
                Order *ord = order_create(om, order_id, next_cust->id, t1->id, ORDER_PRIORITY_DINE_IN);
                if (ord != NULL)
                {
                    metrics_record_order_placed(metrics);
                    printf("  -> Created Order #%d (Type: %s, Status: %s)\n",
                           ord->id, order_priority_str(ord->priority), order_status_str(ord->status));
                }
            }
            else
            {
                printf("  -> No suitable table or combination available right now. Customer remains waiting.\n");
            }
        }
    }

    seating_display_layout(sm);
    order_display_active(om);

    /* Step 3: Kitchen workflow & DAG execution */
    printf(">>> [3/5] Kitchen Workflow & DAG Task Dispatch\n");
    dag_display_workflow(dag);

    /* Assign kitchen stations for active orders */
    KitchenStation *assigned_station = kitchen_assign_station(km);
    if (assigned_station != NULL)
    {
        printf("Kitchen Station Assigned: [%s] (ID: %d)\n",
               assigned_station->name, assigned_station->id);
    }
    kitchen_display_status(km);

    /* Step 4: Advance Orders (Preparing -> Served -> Completed) */
    printf(">>> [4/5] Advancing Order Statuses & Meal Delivery\n");
    ListNode *curr = om->active_orders->head;
    while (curr != NULL)
    {
        Order *ord = (Order *)curr->data;
        ListNode *next_node = curr->next;
        if (ord != NULL)
        {
            order_update_status(om, ord->id, ORDER_STATUS_PREPARING);
            printf("Order #%d: %s\n", ord->id, order_status_str(ord->status));

            order_update_status(om, ord->id, ORDER_STATUS_SERVED);
            printf("Order #%d: %s\n", ord->id, order_status_str(ord->status));

            order_complete(om, ord->id);
            printf("Order #%d: %s (Removed from active orders list)\n",
                   ord->id, order_status_str(ORDER_STATUS_COMPLETED));
            metrics_record_order_completed(metrics);
        }
        curr = next_node;
    }

    /* Release kitchen station */
    if (assigned_station != NULL)
    {
        kitchen_release_station(km, assigned_station->id);
        printf("Kitchen Station #%d released back to available.\n", assigned_station->id);
    }

    /* Free tables */
    for (int i = 0; i < num_seated; i++)
    {
        seating_free_table(sm, seated_tables[i]);
        printf("Table %d vacated and cleaned.\n", seated_tables[i]);
    }

    /* Step 5: Final Metrics Summary */
    printf("\n>>> [5/5] Simulation Cycle Complete. System Metrics:\n");
    size_t occupied = 0;
    for (size_t i = 0; i < sm->count; i++)
    {
        if (sm->tables[i].occupied)
        {
            occupied++;
        }
    }
    metrics_display(metrics, occupied, sm->count);
}
