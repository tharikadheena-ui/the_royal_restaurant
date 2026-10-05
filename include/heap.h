#ifndef HEAP_H
#define HEAP_H

#include <stddef.h>

typedef int (*CompareFunc)(const void *, const void *);

typedef struct
{
    void **data;
    size_t size;
    size_t capacity;
    CompareFunc compare;
} Heap;

Heap *heap_create(size_t capacity, CompareFunc compare);

void heap_destroy(Heap *heap);

int heap_push(Heap *heap, void *item);

void *heap_pop(Heap *heap);

void *heap_peek(const Heap *heap);

int heap_is_empty(const Heap *heap);

#endif