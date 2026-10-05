#include "../include/hash_table.h"

#include <assert.h>
#include <stdio.h>
#include <string.h>

typedef struct
{
    int id;
    char name[20];
} TestItem;

int main(void)
{
    HashTable *ht = ht_create(10);
    assert(ht != NULL);
    assert(ht->size == 0);

    TestItem item1 = {101, "Alice"};
    TestItem item2 = {102, "Bob"};
    TestItem item3 = {112, "Charlie"}; /* Collides with 102 (112 % 10 == 2) */
    TestItem item4 = {104, "David"};

    /* Test insert */
    assert(ht_insert(ht, item1.id, &item1) == 1);
    assert(ht_insert(ht, item2.id, &item2) == 1);
    assert(ht_insert(ht, item3.id, &item3) == 1);
    assert(ht_insert(ht, item4.id, &item4) == 1);
    assert(ht->size == 4);

    /* Test search */
    TestItem *found = ht_search(ht, 102);
    assert(found != NULL);
    assert(strcmp(found->name, "Bob") == 0);

    found = ht_search(ht, 112);
    assert(found != NULL);
    assert(strcmp(found->name, "Charlie") == 0);

    assert(ht_search(ht, 999) == NULL);

    /* Test update */
    TestItem item2_updated = {102, "Bob_Updated"};
    assert(ht_update(ht, 102, &item2_updated) == 1);
    found = ht_search(ht, 102);
    assert(found != NULL);
    assert(strcmp(found->name, "Bob_Updated") == 0);

    /* Test remove */
    assert(ht_remove(ht, 102) == 1);
    assert(ht_search(ht, 102) == NULL);
    assert(ht->size == 3);

    /* Collided element 112 should still be reachable */
    found = ht_search(ht, 112);
    assert(found != NULL);
    assert(strcmp(found->name, "Charlie") == 0);

    /* Remove non-existent key */
    assert(ht_remove(ht, 999) == 0);

    ht_destroy(ht);
    printf("All hash table tests passed!\n");
    return 0;
}
