#include "../include/kitchen.h"

#include <stdio.h>
#include <string.h>

void kitchen_init(KitchenManager *km)
{
    if (km == NULL)
    {
        return;
    }

    km->count = 0;
    kitchen_add_station(km, 1, "Grill & Stove");
    kitchen_add_station(km, 2, "Fryer & Sides");
    kitchen_add_station(km, 3, "Baking & Oven");
    kitchen_add_station(km, 4, "Salad & Cold Prep");
    kitchen_add_station(km, 5, "Beverage & Dessert");
}

int kitchen_add_station(KitchenManager *km, int id, const char *name)
{
    if (km == NULL || km->count >= MAX_KITCHEN_STATIONS || name == NULL)
    {
        return 0;
    }

    for (size_t i = 0; i < km->count; i++)
    {
        if (km->stations[i].id == id)
        {
            return 0;
        }
    }

    KitchenStation *st = &km->stations[km->count];
    st->id = id;
    strncpy(st->name, name, sizeof(st->name) - 1);
    st->name[sizeof(st->name) - 1] = '\0';
    st->available = 1;

    km->count++;
    return 1;
}

KitchenStation *kitchen_assign_station(KitchenManager *km)
{
    if (km == NULL)
    {
        return NULL;
    }

    for (size_t i = 0; i < km->count; i++)
    {
        if (km->stations[i].available)
        {
            km->stations[i].available = 0;
            return &km->stations[i];
        }
    }

    return NULL;
}

int kitchen_release_station(KitchenManager *km, int id)
{
    KitchenStation *st = kitchen_get_station(km, id);
    if (st == NULL || st->available)
    {
        return 0;
    }

    st->available = 1;
    return 1;
}

KitchenStation *kitchen_get_station(KitchenManager *km, int id)
{
    if (km == NULL)
    {
        return NULL;
    }

    for (size_t i = 0; i < km->count; i++)
    {
        if (km->stations[i].id == id)
        {
            return &km->stations[i];
        }
    }

    return NULL;
}

void kitchen_display_status(const KitchenManager *km)
{
    if (km == NULL || km->count == 0)
    {
        printf("No kitchen stations configured.\n");
        return;
    }

    printf("\n=================== KITCHEN WORKFLOW STATUS ===================\n");
    printf("%-10s | %-25s | %-15s\n", "Station ID", "Station Name", "Status");
    printf("---------------------------------------------------------------\n");

    for (size_t i = 0; i < km->count; i++)
    {
        printf("Station %-3d | %-25s | %s\n",
               km->stations[i].id,
               km->stations[i].name,
               km->stations[i].available ? "[ AVAILABLE ]" : "[ BUSY ]");
    }
    printf("===============================================================\n\n");
}
