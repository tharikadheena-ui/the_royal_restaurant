#ifndef LIST_H
#define LIST_H

#include <stddef.h>

typedef struct ListNode
{
    void *data;
    struct ListNode *next;
} ListNode;

typedef struct
{
    ListNode *head;
    size_t size;
} List;

/* Create an empty linked list */
List *list_create(void);

/* Destroy the linked list container and its nodes (does not free node data) */
void list_destroy(List *list);

/* Insert a new item at the end of the list. Returns 1 on success, 0 on failure */
int list_insert(List *list, void *data);

/* Remove the first node whose data pointer matches 'data'. Returns 1 if removed, 0 if not found */
int list_remove(List *list, void *data);

/* Traverse the list and call the callback function on each node's data */
void list_traverse(const List *list, void (*callback)(void *data));

#endif
