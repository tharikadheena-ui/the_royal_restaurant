#include "../include/heap.h"

#include <stdlib.h>

static void swap(void **a, void **b)
{
    void *temp = *a;
    *a = *b;
    *b = temp;
}

static void heapify_up(Heap *heap, size_t index)
{
    while (index > 0)
    {
        size_t parent = (index - 1) / 2;

        if (heap->compare(heap->data[index],
                          heap->data[parent]) >= 0)
        {
            break;
        }

        swap(&heap->data[index], &heap->data[parent]);

        index = parent;
    }
}

static void heapify_down(Heap *heap, size_t index)
{
    while (1)
    {
        size_t left = 2 * index + 1;
        size_t right = 2 * index + 2;
        size_t smallest = index;

        if (left < heap->size &&
            heap->compare(heap->data[left],
                          heap->data[smallest]) < 0)
        {
            smallest = left;
        }

        if (right < heap->size &&
            heap->compare(heap->data[right],
                          heap->data[smallest]) < 0)
        {
            smallest = right;
        }

        if (smallest == index)
        {
            break;
        }

        swap(&heap->data[index],
             &heap->data[smallest]);

        index = smallest;
    }
}

Heap *heap_create(size_t capacity, CompareFunc compare)
{
    if (capacity == 0 || compare == NULL)
    {
        return NULL;
    }

    Heap *heap = malloc(sizeof(Heap));

    if (heap == NULL)
    {
        return NULL;
    }

    heap->data = malloc(sizeof(void *) * capacity);

    if (heap->data == NULL)
    {
        free(heap);
        return NULL;
    }

    heap->size = 0;
    heap->capacity = capacity;
    heap->compare = compare;

    return heap;
}

void heap_destroy(Heap *heap)
{
    if (heap == NULL)
    {
        return;
    }

    free(heap->data);
    free(heap);
}

int heap_push(Heap *heap, void *item)
{
    if (heap == NULL || item == NULL)
    {
        return 0;
    }

    if (heap->size == heap->capacity)
    {
        size_t new_capacity = heap->capacity * 2;

        void **new_data =
            realloc(heap->data,
                    sizeof(void *) * new_capacity);

        if (new_data == NULL)
        {
            return 0;
        }

        heap->data = new_data;
        heap->capacity = new_capacity;
    }

    heap->data[heap->size] = item;

    heapify_up(heap, heap->size);

    heap->size++;

    return 1;
}

void *heap_pop(Heap *heap)
{
    if (heap == NULL || heap->size == 0)
    {
        return NULL;
    }

    void *top = heap->data[0];

    heap->size--;

    if (heap->size > 0)
    {
        heap->data[0] = heap->data[heap->size];

        heapify_down(heap, 0);
    }

    return top;
}

void *heap_peek(const Heap *heap)
{
    if (heap == NULL || heap->size == 0)
    {
        return NULL;
    }

    return heap->data[0];
}

int heap_is_empty(const Heap *heap)
{
    return heap == NULL || heap->size == 0;
}