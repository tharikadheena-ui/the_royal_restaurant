#ifndef QUEUE_H
#define QUEUE_H

#include <stddef.h>
#include "model.h"
#include "heap.h"

typedef struct
{
    Heap *heap;
} PriorityQueue;

/* Create a priority queue for customers */
PriorityQueue *queue_create(size_t capacity);

/* Destroy the priority queue (does not free Customer instances) */
void queue_destroy(PriorityQueue *pq);

/* Add a customer to the priority queue. Returns 1 on success, 0 on failure */
int queue_enqueue(PriorityQueue *pq, Customer *customer);

/* Remove and return the highest-priority customer. Returns NULL if empty */
Customer *queue_dequeue(PriorityQueue *pq);

/* Peek at the highest-priority customer without removing. Returns NULL if empty */
Customer *queue_peek(const PriorityQueue *pq);

/* Check if the queue is empty */
int queue_is_empty(const PriorityQueue *pq);

/* Get number of customers currently in queue */
size_t queue_size(const PriorityQueue *pq);

/* Get 1-based position of customer in queue by customer_id (-1 if not found) */
int queue_get_position(const PriorityQueue *pq, int customer_id);

/* Calculate estimated wait time in minutes for a given position */
int queue_estimated_wait_time(int position);

/* Print all customers in the queue ordered by priority */
void queue_print(const PriorityQueue *pq);

#endif
