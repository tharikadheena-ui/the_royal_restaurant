#include "../include/hash_table.h"

#include <stdlib.h>

static size_t hash_function(int key, size_t capacity)
{
    unsigned int ukey = (key < 0) ? (unsigned int)(-key) : (unsigned int)key;
    return (size_t)(ukey % capacity);
}

HashTable *ht_create(size_t capacity)
{
    if (capacity == 0)
    {
        return NULL;
    }

    HashTable *table = malloc(sizeof(HashTable));
    if (table == NULL)
    {
        return NULL;
    }

    table->buckets = calloc(capacity, sizeof(HashNode *));
    if (table->buckets == NULL)
    {
        free(table);
        return NULL;
    }

    table->capacity = capacity;
    table->size = 0;
    return table;
}

void ht_destroy(HashTable *table)
{
    if (table == NULL)
    {
        return;
    }

    for (size_t i = 0; i < table->capacity; i++)
    {
        HashNode *curr = table->buckets[i];
        while (curr != NULL)
        {
            HashNode *next = curr->next;
            free(curr);
            curr = next;
        }
    }

    free(table->buckets);
    free(table);
}

int ht_insert(HashTable *table, int key, void *value)
{
    if (table == NULL)
    {
        return 0;
    }

    size_t index = hash_function(key, table->capacity);
    HashNode *curr = table->buckets[index];

    /* If key exists, update value */
    while (curr != NULL)
    {
        if (curr->key == key)
        {
            curr->value = value;
            return 1;
        }
        curr = curr->next;
    }

    /* Key does not exist, insert at head of bucket */
    HashNode *new_node = malloc(sizeof(HashNode));
    if (new_node == NULL)
    {
        return 0;
    }

    new_node->key = key;
    new_node->value = value;
    new_node->next = table->buckets[index];
    table->buckets[index] = new_node;
    table->size++;

    return 1;
}

void *ht_search(const HashTable *table, int key)
{
    if (table == NULL)
    {
        return NULL;
    }

    size_t index = hash_function(key, table->capacity);
    HashNode *curr = table->buckets[index];

    while (curr != NULL)
    {
        if (curr->key == key)
        {
            return curr->value;
        }
        curr = curr->next;
    }

    return NULL;
}

int ht_update(HashTable *table, int key, void *value)
{
    if (table == NULL)
    {
        return 0;
    }

    size_t index = hash_function(key, table->capacity);
    HashNode *curr = table->buckets[index];

    while (curr != NULL)
    {
        if (curr->key == key)
        {
            curr->value = value;
            return 1;
        }
        curr = curr->next;
    }

    return 0;
}

int ht_remove(HashTable *table, int key)
{
    if (table == NULL)
    {
        return 0;
    }

    size_t index = hash_function(key, table->capacity);
    HashNode *curr = table->buckets[index];
    HashNode *prev = NULL;

    while (curr != NULL)
    {
        if (curr->key == key)
        {
            if (prev == NULL)
            {
                table->buckets[index] = curr->next;
            }
            else
            {
                prev->next = curr->next;
            }

            free(curr);
            table->size--;
            return 1;
        }
        prev = curr;
        curr = curr->next;
    }

    return 0;
}
