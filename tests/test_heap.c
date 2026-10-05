#include "../include/heap.h"

#include <assert.h>
#include <stdio.h>

int compare_ints(const void *a, const void *b)
{
    int x = *(const int *)a;
    int y = *(const int *)b;

    if (x < y)
    {
        return -1;
    }

    if (x > y)
    {
        return 1;
    }

    return 0;
}

int main(void)
{
    Heap *heap = heap_create(4, compare_ints);

    assert(heap != NULL);

    int a = 40;
    int b = 10;
    int c = 30;
    int d = 20;

    heap_push(heap, &a);
    heap_push(heap, &b);
    heap_push(heap, &c);
    heap_push(heap, &d);

    int *top = heap_peek(heap);

    assert(*top == 10);

    printf("Peek: %d\n", *top);

    while (!heap_is_empty(heap))
    {
        int *value = heap_pop(heap);
        printf("%d ", *value);
    }

    printf("\n");

    heap_destroy(heap);

    printf("All heap tests passed!\n");

    return 0;
}