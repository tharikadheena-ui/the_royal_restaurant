#ifndef DAG_H
#define DAG_H

#include <stddef.h>

#define MAX_TASKS 10

typedef struct
{
    int id;
    char name[50];
    int duration; /* duration in minutes */
} WorkflowTask;

typedef struct
{
    WorkflowTask tasks[MAX_TASKS];
    int adj[MAX_TASKS][MAX_TASKS]; /* adj[u][v] = 1 means task u precedes task v */
    size_t num_tasks;
} DAG;

/* Initialize an empty DAG */
void dag_init(DAG *dag);

/* Add a task to the DAG. Returns task index (0 to num_tasks-1) or -1 on failure */
int dag_add_task(DAG *dag, int id, const char *name, int duration);

/* Add a directed dependency: task 'from_id' must complete before task 'to_id' can begin. Returns 1 on success, 0 on failure */
int dag_add_dependency(DAG *dag, int from_id, int to_id);

/* Perform topological sort using Kahn's algorithm (in-degree).
   Fills 'order_out' with task indices in topological order. Returns 1 if valid DAG, 0 if cycle detected */
int dag_topological_sort(const DAG *dag, int *order_out);

/* Calculate critical path and total ETA (in minutes).
   Optionally writes earliest start times to 'earliest_start_out'. Returns total ETA in minutes */
int dag_calculate_eta(const DAG *dag, int *earliest_start_out);

/* Display the DAG workflow, topological order, and critical path ETA */
void dag_display_workflow(const DAG *dag);

/* Pre-populate a standard restaurant order workflow */
void dag_create_default_workflow(DAG *dag);

#endif
