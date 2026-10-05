#ifndef MODELS_H
#define MODELS_H

typedef struct
{
    int id;
    int group_size;
    int priority;
} Customer;

typedef struct
{
    int id;
    int capacity;
    int occupied;
} Table;

typedef struct
{
    int id;
    int customer_id;
    int table_id;
    int priority;
    int status;
} Order;

typedef struct
{
    int id;
    char name[50];
    int available;
} KitchenStation;

#endif