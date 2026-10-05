#ifndef METRICS_H
#define METRICS_H

#include <stddef.h>

typedef struct
{
    int total_customers_arrived;
    int total_customers_seated;
    int total_orders_placed;
    int total_orders_completed;
    int total_wait_time_minutes;
} RestaurantMetrics;

/* Initialize metrics counters */
void metrics_init(RestaurantMetrics *m);

/* Record a new customer arrival and their estimated wait */
void metrics_record_arrival(RestaurantMetrics *m, int wait_time);

/* Record customer seated */
void metrics_record_seated(RestaurantMetrics *m);

/* Record order placed */
void metrics_record_order_placed(RestaurantMetrics *m);

/* Record order completed */
void metrics_record_order_completed(RestaurantMetrics *m);

/* Display summary of restaurant performance metrics */
void metrics_display(const RestaurantMetrics *m, size_t occupied_tables, size_t total_tables);

#endif
