#include "../include/seating.h"
#include "../include/heap.h"

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

static int compare_tables_best_fit(const void *a, const void *b)
{
    const Table *t1 = (const Table *)a;
    const Table *t2 = (const Table *)b;

    /* Min-heap: smaller capacity has higher priority (best fit) */
    if (t1->capacity < t2->capacity)
    {
        return -1;
    }
    if (t1->capacity > t2->capacity)
    {
        return 1;
    }
    /* Tie-breaker: lower table ID first */
    if (t1->id < t2->id)
    {
        return -1;
    }
    if (t1->id > t2->id)
    {
        return 1;
    }
    return 0;
}

void seating_init(SeatingManager *sm)
{
    if (sm == NULL)
    {
        return;
    }

    sm->count = 0;
    for (size_t i = 0; i < MAX_TABLES; i++)
    {
        sm->tables[i].id = 0;
        sm->tables[i].capacity = 0;
        sm->tables[i].occupied = 0;
        for (size_t j = 0; j < MAX_TABLES; j++)
        {
            sm->adjacency[i][j] = 0;
        }
    }
}

int seating_add_table(SeatingManager *sm, int id, int capacity)
{
    if (sm == NULL || sm->count >= MAX_TABLES || capacity <= 0)
    {
        return 0;
    }

    /* Check if table ID already exists */
    for (size_t i = 0; i < sm->count; i++)
    {
        if (sm->tables[i].id == id)
        {
            return 0;
        }
    }

    size_t k = sm->count;
    sm->tables[k].id = id;
    sm->tables[k].capacity = capacity;
    sm->tables[k].occupied = 0;
    sm->count++;

    /* Automatically configure physical adjacency according to the restaurant's
       2-column floor plan:
         Row 0: Table 1 (cap 2)  <---> Table 2 (cap 2)
                   ^                       ^
                   |                       |
                   v                       v
         Row 1: Table 3 (cap 4)  <---> Table 4 (cap 4)
                   ^                       ^
                   |                       |
                   v                       v
         Row 2: Table 5 (cap 6)  <---> Table 6 (cap 8)
       Horizontal adjacency: k is odd -> adjacent to k - 1
       Vertical adjacency: k >= 2     -> adjacent to k - 2 */
    if (k % 2 == 1)
    {
        sm->adjacency[k][k - 1] = 1;
        sm->adjacency[k - 1][k] = 1;
    }
    if (k >= 2)
    {
        sm->adjacency[k][k - 2] = 1;
        sm->adjacency[k - 2][k] = 1;
    }

    return 1;
}

int seating_set_adjacent(SeatingManager *sm, int id1, int id2)
{
    if (sm == NULL || id1 == id2)
    {
        return 0;
    }

    int idx1 = -1;
    int idx2 = -1;
    for (size_t i = 0; i < sm->count; i++)
    {
        if (sm->tables[i].id == id1)
        {
            idx1 = (int)i;
        }
        if (sm->tables[i].id == id2)
        {
            idx2 = (int)i;
        }
    }

    if (idx1 == -1 || idx2 == -1)
    {
        return 0;
    }

    sm->adjacency[idx1][idx2] = 1;
    sm->adjacency[idx2][idx1] = 1;
    return 1;
}

int seating_are_adjacent(const SeatingManager *sm, int id1, int id2)
{
    if (sm == NULL || id1 == id2)
    {
        return 0;
    }

    int idx1 = -1;
    int idx2 = -1;
    for (size_t i = 0; i < sm->count; i++)
    {
        if (sm->tables[i].id == id1)
        {
            idx1 = (int)i;
        }
        if (sm->tables[i].id == id2)
        {
            idx2 = (int)i;
        }
    }

    if (idx1 == -1 || idx2 == -1)
    {
        return 0;
    }

    return sm->adjacency[idx1][idx2];
}

Table *seating_get_table(SeatingManager *sm, int id)
{
    if (sm == NULL)
    {
        return NULL;
    }

    for (size_t i = 0; i < sm->count; i++)
    {
        if (sm->tables[i].id == id)
        {
            return &sm->tables[i];
        }
    }
    return NULL;
}

Table *seating_find_best_fit(const SeatingManager *sm, int group_size)
{
    if (sm == NULL || sm->count == 0 || group_size <= 0)
    {
        return NULL;
    }

    Heap *heap = heap_create(sm->count, compare_tables_best_fit);
    if (heap == NULL)
    {
        return NULL;
    }

    for (size_t i = 0; i < sm->count; i++)
    {
        if (!sm->tables[i].occupied && sm->tables[i].capacity >= group_size)
        {
            heap_push(heap, (void *)&sm->tables[i]);
        }
    }

    Table *best = NULL;
    if (!heap_is_empty(heap))
    {
        best = (Table *)heap_peek(heap);
    }

    heap_destroy(heap);
    return best;
}

int seating_find_adjacent_combination(const SeatingManager *sm, int group_size, Table **t1, Table **t2)
{
    if (sm == NULL || sm->count < 2 || group_size <= 0 || t1 == NULL || t2 == NULL)
    {
        return 0;
    }

    int best_i = -1;
    int best_j = -1;
    int min_waste = INT_MAX;

    /* Search ALL valid adjacent table combinations in the restaurant layout
       Objective:
         1. Combined capacity >= group_size
         2. Minimizes seat waste (combined_capacity - group_size)
         3. Tie-breaker: preserve earlier candidate / lower table IDs */
    for (size_t i = 0; i < sm->count; i++)
    {
        if (sm->tables[i].occupied)
        {
            continue;
        }

        for (size_t j = i + 1; j < sm->count; j++)
        {
            if (sm->tables[j].occupied)
            {
                continue;
            }

            /* Physical adjacency check based on restaurant layout */
            if (!sm->adjacency[i][j])
            {
                continue;
            }

            int combined = sm->tables[i].capacity + sm->tables[j].capacity;
            if (combined >= group_size)
            {
                int waste = combined - group_size;
                if (waste < min_waste)
                {
                    min_waste = waste;
                    best_i = (int)i;
                    best_j = (int)j;
                }
            }
        }
    }

    if (best_i != -1 && best_j != -1)
    {
        *t1 = (Table *)&sm->tables[best_i];
        *t2 = (Table *)&sm->tables[best_j];
        return 1;
    }

    return 0;
}

int seating_occupy_table(SeatingManager *sm, int table_id)
{
    Table *t = seating_get_table(sm, table_id);
    if (t == NULL || t->occupied)
    {
        return 0;
    }

    t->occupied = 1;
    return 1;
}

int seating_free_table(SeatingManager *sm, int table_id)
{
    Table *t = seating_get_table(sm, table_id);
    if (t == NULL || !t->occupied)
    {
        return 0;
    }

    t->occupied = 0;
    return 1;
}

void seating_display_layout(const SeatingManager *sm)
{
    if (sm == NULL || sm->count == 0)
    {
        printf("No tables configured in the restaurant.\n");
        return;
    }

    printf("\n=================== RESTAURANT LAYOUT ===================\n");
    printf("%-10s | %-12s | %-15s\n", "Table ID", "Capacity", "Status");
    printf("---------------------------------------------------------\n");

    for (size_t i = 0; i < sm->count; i++)
    {
        printf("Table %-4d | %-12d | %s\n",
               sm->tables[i].id,
               sm->tables[i].capacity,
               sm->tables[i].occupied ? "[ OCCUPIED ]" : "[ AVAILABLE ]");
    }
    printf("---------------------------------------------------------\n");
    printf("Physical Adjacencies (Combinable Pairs):\n");
    for (size_t i = 0; i < sm->count; i++)
    {
        for (size_t j = i + 1; j < sm->count; j++)
        {
            if (sm->adjacency[i][j])
            {
                printf("  - Table %d (cap %d) <---> Table %d (cap %d) [Combined: %d]\n",
                       sm->tables[i].id, sm->tables[i].capacity,
                       sm->tables[j].id, sm->tables[j].capacity,
                       sm->tables[i].capacity + sm->tables[j].capacity);
            }
        }
    }
    printf("=========================================================\n\n");
}
