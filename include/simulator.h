#ifndef SIMULATOR_H
#define SIMULATOR_H

#include "seating.h"
#include "queue.h"
#include "orders.h"
#include "kitchen.h"
#include "dag.h"
#include "metrics.h"

/* Run a restaurant simulation cycle demonstrating all integrated DSA modules */
void simulator_run_cycle(SeatingManager *sm,
                         PriorityQueue *pq,
                         OrderManager *om,
                         KitchenManager *km,
                         const DAG *dag,
                         RestaurantMetrics *metrics);

#endif
