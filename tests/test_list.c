#include "../include/list.h"

#include <assert.h>
#include <stdio.h>

static void print_int(void *data)
{
    int *val = (int *)data;
    printf("%d ", *val);
}

int main(void)
{
    List *list = list_create();
    assert(list != NULL);
    assert(list->size == 0);

    int a = 10, b = 20, c = 30, d = 40;

    assert(list_insert(list, &a) == 1);
    assert(list_insert(list, &b) == 1);
    assert(list_insert(list, &c) == 1);
    assert(list_insert(list, &d) == 1);
    assert(list->size == 4);

    printf("List elements: ");
    list_traverse(list, print_int);
    printf("\n");

    /* Remove element from middle */
    assert(list_remove(list, &b) == 1);
    assert(list->size == 3);

    /* Remove element from head */
    assert(list_remove(list, &a) == 1);
    assert(list->size == 2);

    /* Try removing element not present */
    assert(list_remove(list, &b) == 0);

    printf("After removal: ");
    list_traverse(list, print_int);
    printf("\n");

    list_destroy(list);
    printf("All list tests passed!\n");
    return 0;
}
