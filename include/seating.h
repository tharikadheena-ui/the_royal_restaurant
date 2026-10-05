#ifndef SEATING_H
#define SEATING_H

#include <stddef.h>
#include "model.h"
#include "constants.h"

typedef struct
{
    Table tables[MAX_TABLES];
    size_t count;
    int adjacency[MAX_TABLES][MAX_TABLES]; /* Physical layout adjacency matrix */
} SeatingManager;

/* Initialize the seating manager */
void seating_init(SeatingManager *sm);

/* Add a table to the seating manager. Returns 1 on success, 0 on failure */
int seating_add_table(SeatingManager *sm, int id, int capacity);

/* Explicitly set two tables as physically adjacent by their IDs. Returns 1 on success, 0 on failure */
int seating_set_adjacent(SeatingManager *sm, int id1, int id2);

/* Check if two tables are physically adjacent by their IDs. Returns 1 if adjacent, 0 otherwise */
int seating_are_adjacent(const SeatingManager *sm, int id1, int id2);

/* Get table by ID. Returns pointer to table, or NULL if not found */
Table *seating_get_table(SeatingManager *sm, int id);

/* Find the best-fit available table for a group size using min-heap logic. Returns NULL if none fit */
Table *seating_find_best_fit(const SeatingManager *sm, int group_size);

/* Find two adjacent unoccupied tables that together can seat the group.
   Sets *t1 and *t2 if found and returns 1, otherwise returns 0 */
int seating_find_adjacent_combination(const SeatingManager *sm, int group_size, Table **t1, Table **t2);

/* Mark a table as occupied. Returns 1 on success, 0 if not found or already occupied */
int seating_occupy_table(SeatingManager *sm, int table_id);

/* Mark a table as free. Returns 1 on success, 0 if not found or already free */
int seating_free_table(SeatingManager *sm, int table_id);

/* Display the restaurant layout (table IDs, capacities, and availability) */
void seating_display_layout(const SeatingManager *sm);

#endif
