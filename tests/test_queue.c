#include "../include/queue.h"

#include <assert.h>
#include <stdio.h>

int main(void)
{
    PriorityQueue *pq = queue_create(5);
    assert(pq != NULL);
    assert(queue_is_empty(pq) == 1);

    Customer c1 = {.id = 1, .group_size = 2, .priority = 1};
    Customer c2 = {.id = 2, .group_size = 4, .priority = 5};
    Customer c3 = {.id = 3, .group_size = 2, .priority = 3};
    Customer c4 = {.id = 4, .group_size = 6, .priority = 5};

    assert(queue_enqueue(pq, &c1) == 1);
    assert(queue_enqueue(pq, &c2) == 1);
    assert(queue_enqueue(pq, &c3) == 1);
    assert(queue_enqueue(pq, &c4) == 1);
    assert(queue_size(pq) == 4);

    /* Both c2 and c4 have priority 5, c2 has smaller ID so c2 should be first */
    Customer *peeked = queue_peek(pq);
    assert(peeked != NULL);
    assert(peeked->id == 2);

    int pos_c2 = queue_get_position(pq, 2);
    int pos_c4 = queue_get_position(pq, 4);
    int pos_c3 = queue_get_position(pq, 3);
    int pos_c1 = queue_get_position(pq, 1);

    assert(pos_c2 == 1);
    assert(pos_c4 == 2);
    assert(pos_c3 == 3);
    assert(pos_c1 == 4);

    assert(queue_estimated_wait_time(pos_c2) == 0);
    assert(queue_estimated_wait_time(pos_c4) == 5);
    assert(queue_estimated_wait_time(pos_c3) == 10);
    assert(queue_estimated_wait_time(pos_c1) == 15);

    queue_print(pq);

    /* Dequeue all and verify order */
    Customer *d1 = queue_dequeue(pq);
    Customer *d2 = queue_dequeue(pq);
    Customer *d3 = queue_dequeue(pq);
    Customer *d4 = queue_dequeue(pq);

    assert(d1->id == 2);
    assert(d2->id == 4);
    assert(d3->id == 3);
    assert(d4->id == 1);

    assert(queue_is_empty(pq) == 1);
    assert(queue_dequeue(pq) == NULL);

    queue_destroy(pq);
    printf("All queue tests passed!\n");
    return 0;
}
