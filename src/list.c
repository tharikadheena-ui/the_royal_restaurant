#include "../include/list.h"

#include <stdlib.h>

List *list_create(void)
{
    List *list = malloc(sizeof(List));
    if (list == NULL)
    {
        return NULL;
    }

    list->head = NULL;
    list->size = 0;
    return list;
}

void list_destroy(List *list)
{
    if (list == NULL)
    {
        return;
    }

    ListNode *curr = list->head;
    while (curr != NULL)
    {
        ListNode *next = curr->next;
        free(curr);
        curr = next;
    }

    free(list);
}

int list_insert(List *list, void *data)
{
    if (list == NULL)
    {
        return 0;
    }

    ListNode *new_node = malloc(sizeof(ListNode));
    if (new_node == NULL)
    {
        return 0;
    }

    new_node->data = data;
    new_node->next = NULL;

    if (list->head == NULL)
    {
        list->head = new_node;
    }
    else
    {
        ListNode *curr = list->head;
        while (curr->next != NULL)
        {
            curr = curr->next;
        }
        curr->next = new_node;
    }

    list->size++;
    return 1;
}

int list_remove(List *list, void *data)
{
    if (list == NULL || list->head == NULL)
    {
        return 0;
    }

    ListNode *curr = list->head;
    ListNode *prev = NULL;

    while (curr != NULL)
    {
        if (curr->data == data)
        {
            if (prev == NULL)
            {
                list->head = curr->next;
            }
            else
            {
                prev->next = curr->next;
            }

            free(curr);
            list->size--;
            return 1;
        }
        prev = curr;
        curr = curr->next;
    }

    return 0;
}

void list_traverse(const List *list, void (*callback)(void *data))
{
    if (list == NULL || callback == NULL)
    {
        return;
    }

    ListNode *curr = list->head;
    while (curr != NULL)
    {
        callback(curr->data);
        curr = curr->next;
    }
}
