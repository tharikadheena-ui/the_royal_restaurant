#ifndef ORDERS_H
#define ORDERS_H

#include <stddef.h>
#include "model.h"
#include "list.h"
#include "hash_table.h"

/* Order Priority levels */
#define ORDER_PRIORITY_DELIVERY 1
#define ORDER_PRIORITY_TAKEAWAY 2
#define ORDER_PRIORITY_DINE_IN   3

/* Order Status */
#define ORDER_STATUS_PLACED     0
#define ORDER_STATUS_PREPARING  1
#define ORDER_STATUS_SERVED     2
#define ORDER_STATUS_COMPLETED  3
#define ORDER_STATUS_CANCELLED  4

typedef struct
{
    List *active_orders;      /* Linked list for ongoing orders */
    HashTable *order_lookup;  /* Hash table for O(1) order tracking */
} OrderManager;

/* Create and initialize an order manager */
OrderManager *order_manager_create(void);

/* Destroy order manager and clean up all orders */
void order_manager_destroy(OrderManager *om);

/* Create a new order, add to linked list and hash table. Returns pointer to order or NULL */
Order *order_create(OrderManager *om, int id, int customer_id, int table_id, int priority);

/* Find an order by ID via fast hash table lookup */
Order *order_find(const OrderManager *om, int id);

/* Update status of an existing order. Returns 1 on success, 0 if not found */
int order_update_status(OrderManager *om, int id, int status);

/* Complete an order: updates status to COMPLETED and removes from active list. Returns 1 on success */
int order_complete(OrderManager *om, int id);

/* Display all active orders in the linked list */
void order_display_active(const OrderManager *om);

/* Helper to convert priority int to string */
const char *order_priority_str(int priority);

/* Helper to convert status int to string */
const char *order_status_str(int status);

#endif
