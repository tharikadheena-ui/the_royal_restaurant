#include "../include/queue.h"

#include <stdio.h>
#include <stdlib.h>

static int compare_customers(const void *a, const void *b)
{
    const Customer *c1 = (const Customer *)a;
    const Customer *c2 = (const Customer *)b;

    /* Higher priority number comes first */
    if (c1->priority > c2->priority)
    {
        return -1;
    }
    if (c1->priority < c2->priority)
    {
        return 1;
    }

    /* Tie-breaker: earlier customer id comes first (FIFO) */
    if (c1->id < c2->id)
    {
        return -1;
    }
    if (c1->id > c2->id)
    {
        return 1;
    }

    return 0;
}

PriorityQueue *queue_create(size_t capacity)
{
    PriorityQueue *pq = malloc(sizeof(PriorityQueue));
    if (pq == NULL)
    {
        return NULL;
    }

    pq->heap = heap_create(capacity > 0 ? capacity : 10, compare_customers);
    if (pq->heap == NULL)
    {
        free(pq);
        return NULL;
    }

    return pq;
}

void queue_destroy(PriorityQueue *pq)
{
    if (pq == NULL)
    {
        return;
    }

    if (pq->heap != NULL)
    {
        heap_destroy(pq->heap);
    }

    free(pq);
}

int queue_enqueue(PriorityQueue *pq, Customer *customer)
{
    if (pq == NULL || customer == NULL)
    {
        return 0;
    }

    return heap_push(pq->heap, customer);
}

Customer *queue_dequeue(PriorityQueue *pq)
{
    if (pq == NULL || heap_is_empty(pq->heap))
    {
        return NULL;
    }

    return (Customer *)heap_pop(pq->heap);
}

Customer *queue_peek(const PriorityQueue *pq)
{
    if (pq == NULL || heap_is_empty(pq->heap))
    {
        return NULL;
    }

    return (Customer *)heap_peek(pq->heap);
}

int queue_is_empty(const PriorityQueue *pq)
{
    if (pq == NULL)
    {
        return 1;
    }

    return heap_is_empty(pq->heap);
}

size_t queue_size(const PriorityQueue *pq)
{
    if (pq == NULL || pq->heap == NULL)
    {
        return 0;
    }

    return pq->heap->size;
}

int queue_get_position(const PriorityQueue *pq, int customer_id)
{
    if (pq == NULL || pq->heap == NULL || pq->heap->size == 0)
    {
        return -1;
    }

    Customer *target = NULL;
    for (size_t i = 0; i < pq->heap->size; i++)
    {
        Customer *c = (Customer *)pq->heap->data[i];
        if (c->id == customer_id)
        {
            target = c;
            break;
        }
    }

    if (target == NULL)
    {
        return -1;
    }

    /* Count how many customers have higher priority than target */
    int count_ahead = 0;
    for (size_t i = 0; i < pq->heap->size; i++)
    {
        Customer *c = (Customer *)pq->heap->data[i];
        if (c != target && compare_customers(c, target) < 0)
        {
            count_ahead++;
        }
    }

    return count_ahead + 1;
}

int queue_estimated_wait_time(int position)
{
    if (position <= 0)
    {
        return 0;
    }

    /* Estimate 5 minutes per customer ahead in queue */
    return (position - 1) * 5;
}

void queue_print(const PriorityQueue *pq)
{
    if (pq == NULL || pq->heap == NULL || pq->heap->size == 0)
    {
        printf("Waiting queue is currently empty.\n");
        return;
    }

    size_t n = pq->heap->size;
    Customer **arr = malloc(sizeof(Customer *) * n);
    if (arr == NULL)
    {
        return;
    }

    for (size_t i = 0; i < n; i++)
    {
        arr[i] = (Customer *)pq->heap->data[i];
    }

    /* Simple bubble sort to display strictly in order of service */
    for (size_t i = 0; i < n - 1; i++)
    {
        for (size_t j = 0; j < n - i - 1; j++)
        {
            if (compare_customers(arr[j], arr[j + 1]) > 0)
            {
                Customer *temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    printf("\n--- WAITING QUEUE TRACKER ---\n");
    printf("%-8s | %-12s | %-10s | %-8s | %-15s\n",
           "Position", "Customer ID", "Group Size", "Priority", "Est. Wait Time");
    printf("-----------------------------------------------------------------\n");

    for (size_t i = 0; i < n; i++)
    {
        int pos = (int)(i + 1);
        int est_time = queue_estimated_wait_time(pos);
        printf("%-8d | %-12d | %-10d | %-8d | %d mins\n",
               pos, arr[i]->id, arr[i]->group_size, arr[i]->priority, est_time);
    }
    printf("-----------------------------------------------------------------\n\n");

    free(arr);
}
