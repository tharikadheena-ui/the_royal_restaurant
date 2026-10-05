#include "../include/metrics.h"

#include <stdio.h>

void metrics_init(RestaurantMetrics *m)
{
    if (m == NULL)
    {
        return;
    }

    m->total_customers_arrived = 0;
    m->total_customers_seated = 0;
    m->total_orders_placed = 0;
    m->total_orders_completed = 0;
    m->total_wait_time_minutes = 0;
}

void metrics_record_arrival(RestaurantMetrics *m, int wait_time)
{
    if (m == NULL)
    {
        return;
    }

    m->total_customers_arrived++;
    if (wait_time > 0)
    {
        m->total_wait_time_minutes += wait_time;
    }
}

void metrics_record_seated(RestaurantMetrics *m)
{
    if (m == NULL)
    {
        return;
    }

    m->total_customers_seated++;
}

void metrics_record_order_placed(RestaurantMetrics *m)
{
    if (m == NULL)
    {
        return;
    }

    m->total_orders_placed++;
}

void metrics_record_order_completed(RestaurantMetrics *m)
{
    if (m == NULL)
    {
        return;
    }

    m->total_orders_completed++;
}

void metrics_display(const RestaurantMetrics *m, size_t occupied_tables, size_t total_tables)
{
    if (m == NULL)
    {
        return;
    }

    double avg_wait = 0.0;
    if (m->total_customers_arrived > 0)
    {
        avg_wait = (double)m->total_wait_time_minutes / (double)m->total_customers_arrived;
    }

    double table_utilization = 0.0;
    if (total_tables > 0)
    {
        table_utilization = ((double)occupied_tables / (double)total_tables) * 100.0;
    }

    printf("\n=================== SYSTEM METRICS & PERFORMANCE ===================\n");
    printf("Total Customers Arrived : %d\n", m->total_customers_arrived);
    printf("Total Customers Seated  : %d\n", m->total_customers_seated);
    printf("Total Orders Placed     : %d\n", m->total_orders_placed);
    printf("Total Orders Completed  : %d\n", m->total_orders_completed);
    printf("Average Estimated Wait  : %.1f minutes\n", avg_wait);
    printf("Table Utilization       : %.1f%% (%zu / %zu tables occupied)\n",
           table_utilization, occupied_tables, total_tables);
    printf("====================================================================\n\n");
}
