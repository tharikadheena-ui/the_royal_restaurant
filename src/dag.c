#include "../include/dag.h"

#include <stdio.h>
#include <string.h>

static int find_task_index(const DAG *dag, int id)
{
    for (size_t i = 0; i < dag->num_tasks; i++)
    {
        if (dag->tasks[i].id == id)
        {
            return (int)i;
        }
    }
    return -1;
}

void dag_init(DAG *dag)
{
    if (dag == NULL)
    {
        return;
    }

    dag->num_tasks = 0;
    for (int i = 0; i < MAX_TASKS; i++)
    {
        dag->tasks[i].id = 0;
        dag->tasks[i].name[0] = '\0';
        dag->tasks[i].duration = 0;
        for (int j = 0; j < MAX_TASKS; j++)
        {
            dag->adj[i][j] = 0;
        }
    }
}

int dag_add_task(DAG *dag, int id, const char *name, int duration)
{
    if (dag == NULL || dag->num_tasks >= MAX_TASKS || name == NULL || duration < 0)
    {
        return -1;
    }

    if (find_task_index(dag, id) != -1)
    {
        return -1;
    }

    int idx = (int)dag->num_tasks;
    dag->tasks[idx].id = id;
    strncpy(dag->tasks[idx].name, name, sizeof(dag->tasks[idx].name) - 1);
    dag->tasks[idx].name[sizeof(dag->tasks[idx].name) - 1] = '\0';
    dag->tasks[idx].duration = duration;

    dag->num_tasks++;
    return idx;
}

int dag_add_dependency(DAG *dag, int from_id, int to_id)
{
    if (dag == NULL)
    {
        return 0;
    }

    int u = find_task_index(dag, from_id);
    int v = find_task_index(dag, to_id);

    if (u == -1 || v == -1 || u == v)
    {
        return 0;
    }

    dag->adj[u][v] = 1;
    return 1;
}

int dag_topological_sort(const DAG *dag, int *order_out)
{
    if (dag == NULL || dag->num_tasks == 0 || order_out == NULL)
    {
        return 0;
    }

    int in_degree[MAX_TASKS] = {0};

    /* Calculate in-degree for each vertex */
    for (size_t u = 0; u < dag->num_tasks; u++)
    {
        for (size_t v = 0; v < dag->num_tasks; v++)
        {
            if (dag->adj[u][v])
            {
                in_degree[v]++;
            }
        }
    }

    /* Simple queue for BFS */
    int queue[MAX_TASKS];
    int front = 0, rear = 0;

    for (size_t i = 0; i < dag->num_tasks; i++)
    {
        if (in_degree[i] == 0)
        {
            queue[rear++] = (int)i;
        }
    }

    size_t count = 0;
    while (front < rear)
    {
        int u = queue[front++];
        order_out[count++] = u;

        for (size_t v = 0; v < dag->num_tasks; v++)
        {
            if (dag->adj[u][v])
            {
                in_degree[v]--;
                if (in_degree[v] == 0)
                {
                    queue[rear++] = (int)v;
                }
            }
        }
    }

    /* Valid DAG only if all tasks were ordered */
    return (count == dag->num_tasks) ? 1 : 0;
}

int dag_calculate_eta(const DAG *dag, int *earliest_start_out)
{
    if (dag == NULL || dag->num_tasks == 0)
    {
        return 0;
    }

    int topo_order[MAX_TASKS];
    if (!dag_topological_sort(dag, topo_order))
    {
        return -1; /* Graph has cycle */
    }

    int earliest_start[MAX_TASKS] = {0};
    int completion_time[MAX_TASKS] = {0};

    for (size_t i = 0; i < dag->num_tasks; i++)
    {
        int u = topo_order[i];
        completion_time[u] = earliest_start[u] + dag->tasks[u].duration;

        for (size_t v = 0; v < dag->num_tasks; v++)
        {
            if (dag->adj[u][v])
            {
                if (completion_time[u] > earliest_start[v])
                {
                    earliest_start[v] = completion_time[u];
                }
            }
        }
    }

    int total_eta = 0;
    for (size_t i = 0; i < dag->num_tasks; i++)
    {
        if (completion_time[i] > total_eta)
        {
            total_eta = completion_time[i];
        }
    }

    if (earliest_start_out != NULL)
    {
        for (size_t i = 0; i < dag->num_tasks; i++)
        {
            earliest_start_out[i] = earliest_start[i];
        }
    }

    return total_eta;
}

void dag_create_default_workflow(DAG *dag)
{
    dag_init(dag);

    dag_add_task(dag, 1, "Order Placed & Verified", 2);
    dag_add_task(dag, 2, "Kitchen Food Cooking", 15);
    dag_add_task(dag, 3, "Bar Drink Preparation", 5);
    dag_add_task(dag, 4, "Plating & Quality Check", 3);
    dag_add_task(dag, 5, "Serving / Delivery Dispatch", 5);

    /* Dependencies */
    dag_add_dependency(dag, 1, 2); /* Cooking depends on Order Placement */
    dag_add_dependency(dag, 1, 3); /* Bar prep depends on Order Placement */
    dag_add_dependency(dag, 2, 4); /* Plating depends on Cooking */
    dag_add_dependency(dag, 3, 4); /* Plating depends on Drink prep */
    dag_add_dependency(dag, 4, 5); /* Serving depends on Plating */
}

void dag_display_workflow(const DAG *dag)
{
    if (dag == NULL || dag->num_tasks == 0)
    {
        printf("Workflow is empty.\n");
        return;
    }

    int topo_order[MAX_TASKS];
    if (!dag_topological_sort(dag, topo_order))
    {
        printf("Error: Workflow graph has cyclical dependencies!\n");
        return;
    }

    int earliest_start[MAX_TASKS] = {0};
    int total_eta = dag_calculate_eta(dag, earliest_start);

    printf("\n==================== ORDER WORKFLOW & DAG ====================\n");
    printf("Dependencies between stages:\n");
    for (size_t u = 0; u < dag->num_tasks; u++)
    {
        for (size_t v = 0; v < dag->num_tasks; v++)
        {
            if (dag->adj[u][v])
            {
                printf("  [%s] ---> [%s]\n", dag->tasks[u].name, dag->tasks[v].name);
            }
        }
    }

    printf("\nExecution Sequence (Topological Order):\n");
    printf("%-5s | %-30s | %-10s | %-12s | %-12s\n",
           "Step", "Stage Name", "Duration", "Start Time", "Finish Time");
    printf("-------------------------------------------------------------------------------\n");

    for (size_t i = 0; i < dag->num_tasks; i++)
    {
        int u = topo_order[i];
        int start = earliest_start[u];
        int finish = start + dag->tasks[u].duration;
        printf("%-5d | %-30s | %2d mins   | T + %2d mins  | T + %2d mins\n",
               (int)(i + 1),
               dag->tasks[u].name,
               dag->tasks[u].duration,
               start,
               finish);
    }
    printf("-------------------------------------------------------------------------------\n");
    printf("Total Estimated Critical Path Duration: %d minutes\n", total_eta);
    printf("===============================================================================\n\n");
}
