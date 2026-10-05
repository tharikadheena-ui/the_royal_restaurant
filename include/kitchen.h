#ifndef KITCHEN_H
#define KITCHEN_H

#include <stddef.h>
#include "model.h"
#include "constants.h"

typedef struct
{
    KitchenStation stations[MAX_KITCHEN_STATIONS];
    size_t count;
} KitchenManager;

/* Initialize kitchen manager with default stations */
void kitchen_init(KitchenManager *km);

/* Add a custom kitchen station. Returns 1 on success, 0 on failure */
int kitchen_add_station(KitchenManager *km, int id, const char *name);

/* Find the first available kitchen station and allocate it (sets available = 0). Returns station or NULL */
KitchenStation *kitchen_assign_station(KitchenManager *km);

/* Release a station by ID (sets available = 1). Returns 1 on success, 0 if not found */
int kitchen_release_station(KitchenManager *km, int id);

/* Get station by ID */
KitchenStation *kitchen_get_station(KitchenManager *km, int id);

/* Display status of all kitchen stations */
void kitchen_display_status(const KitchenManager *km);

#endif
