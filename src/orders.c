#include "../include/orders.h"

#include <stdio.h>
#include <stdlib.h>

const char *order_priority_str(int priority)
{
    switch (priority)
    {
    case ORDER_PRIORITY_DINE_IN:
        return "Dine-In";
    case ORDER_PRIORITY_TAKEAWAY:
        return "Takeaway";
    case ORDER_PRIORITY_DELIVERY:
        return "Delivery";
    default:
        return "Standard";
    }
}

const char *order_status_str(int status)
{
    switch (status)
    {
    case ORDER_STATUS_PLACED:
        return "Placed";
    case ORDER_STATUS_PREPARING:
        return "Preparing";
    case ORDER_STATUS_SERVED:
        return "Served";
    case ORDER_STATUS_COMPLETED:
        return "Completed";
    case ORDER_STATUS_CANCELLED:
        return "Cancelled";
    default:
        return "Unknown";
    }
}

OrderManager *order_manager_create(void)
{
    OrderManager *om = malloc(sizeof(OrderManager));
    if (om == NULL)
    {
        return NULL;
    }

    om->active_orders = list_create();
    if (om->active_orders == NULL)
    {
        free(om);
        return NULL;
    }

    om->order_lookup = ht_create(32);
    if (om->order_lookup == NULL)
    {
        list_destroy(om->active_orders);
        free(om);
        return NULL;
    }

    return om;
}

void order_manager_destroy(OrderManager *om)
{
    if (om == NULL)
    {
        return;
    }

    /* Free all Order structs tracked in the hash table */
    if (om->order_lookup != NULL)
    {
        for (size_t i = 0; i < om->order_lookup->capacity; i++)
        {
            HashNode *curr = om->order_lookup->buckets[i];
            while (curr != NULL)
            {
                if (curr->value != NULL)
                {
                    free(curr->value);
                    curr->value = NULL;
                }
                curr = curr->next;
            }
        }
        ht_destroy(om->order_lookup);
    }

    if (om->active_orders != NULL)
    {
        list_destroy(om->active_orders);
    }

    free(om);
}

Order *order_create(OrderManager *om, int id, int customer_id, int table_id, int priority)
{
    if (om == NULL || id <= 0)
    {
        return NULL;
    }

    /* Check for duplicate order ID */
    if (order_find(om, id) != NULL)
    {
        return NULL;
    }

    Order *ord = malloc(sizeof(Order));
    if (ord == NULL)
    {
        return NULL;
    }

    ord->id = id;
    ord->customer_id = customer_id;
    ord->table_id = table_id;
    ord->priority = priority;
    ord->status = ORDER_STATUS_PLACED;

    ht_insert(om->order_lookup, id, ord);
    list_insert(om->active_orders, ord);

    return ord;
}

Order *order_find(const OrderManager *om, int id)
{
    if (om == NULL || om->order_lookup == NULL)
    {
        return NULL;
    }

    return (Order *)ht_search(om->order_lookup, id);
}

int order_update_status(OrderManager *om, int id, int status)
{
    Order *ord = order_find(om, id);
    if (ord == NULL)
    {
        return 0;
    }

    ord->status = status;
    return 1;
}

int order_complete(OrderManager *om, int id)
{
    Order *ord = order_find(om, id);
    if (ord == NULL)
    {
        return 0;
    }

    ord->status = ORDER_STATUS_COMPLETED;
    list_remove(om->active_orders, ord);
    return 1;
}

void order_display_active(const OrderManager *om)
{
    if (om == NULL || om->active_orders == NULL || om->active_orders->size == 0)
    {
        printf("No active orders at this time.\n");
        return;
    }

    printf("\n======================== ACTIVE ORDERS ========================\n");
    printf("%-10s | %-12s | %-10s | %-12s | %-12s\n",
           "Order ID", "Customer ID", "Table ID", "Type/Priority", "Status");
    printf("---------------------------------------------------------------\n");

    ListNode *curr = om->active_orders->head;
    while (curr != NULL)
    {
        Order *ord = (Order *)curr->data;
        if (ord != NULL)
        {
            printf("%-10d | %-12d | %-10d | %-13s | %-12s\n",
                   ord->id,
                   ord->customer_id,
                   ord->table_id,
                   order_priority_str(ord->priority),
                   order_status_str(ord->status));
        }
        curr = curr->next;
    }
    printf("===============================================================\n\n");
}
