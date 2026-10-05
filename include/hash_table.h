#ifndef HASH_TABLE_H
#define HASH_TABLE_H

#include <stddef.h>

typedef struct HashNode
{
    int key;
    void *value;
    struct HashNode *next;
} HashNode;

typedef struct
{
    HashNode **buckets;
    size_t capacity;
    size_t size;
} HashTable;

/* Create a hash table with the given number of buckets */
HashTable *ht_create(size_t capacity);

/* Destroy the hash table and its nodes (does not free stored values) */
void ht_destroy(HashTable *table);

/* Insert a key-value pair. If key already exists, updates value. Returns 1 on success, 0 on failure */
int ht_insert(HashTable *table, int key, void *value);

/* Search for a value by key. Returns the pointer to value, or NULL if not found */
void *ht_search(const HashTable *table, int key);

/* Update the value for an existing key. Returns 1 if updated, 0 if key not found */
int ht_update(HashTable *table, int key, void *value);

/* Remove a key-value pair from the hash table. Returns 1 if removed, 0 if not found */
int ht_remove(HashTable *table, int key);

#endif
