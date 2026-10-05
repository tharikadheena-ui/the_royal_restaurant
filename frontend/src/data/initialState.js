// Initial state matching the exact C project data structures & constants

export const INITIAL_TABLES = [
  { id: 1, capacity: 2, occupied: false, reserved: false, currentCustomerId: null, groupSize: 0, orderId: null },
  { id: 2, capacity: 2, occupied: false, reserved: false, currentCustomerId: null, groupSize: 0, orderId: null },
  { id: 3, capacity: 4, occupied: true,  reserved: false, currentCustomerId: 104,  groupSize: 3, orderId: 501 },
  { id: 4, capacity: 4, occupied: false, reserved: false, currentCustomerId: null, groupSize: 0, orderId: null },
  { id: 5, capacity: 6, occupied: true,  reserved: false, currentCustomerId: 108,  groupSize: 5, orderId: 502 },
  { id: 6, capacity: 8, occupied: false, reserved: false, currentCustomerId: null, groupSize: 0, orderId: null },
];

export const INITIAL_CUSTOMERS = [
  { id: 112, group_size: 2, priority: 3, priorityLabel: "Urgent", arrivalTime: "19:42", notes: "VIP Ambassador Table Request" },
  { id: 115, group_size: 4, priority: 2, priorityLabel: "VIP", arrivalTime: "19:45", notes: "Anniversary Celebration" },
  { id: 118, group_size: 2, priority: 1, priorityLabel: "Normal", arrivalTime: "19:48", notes: "Walk-in Guest" },
  { id: 120, group_size: 7, priority: 1, priorityLabel: "Normal", arrivalTime: "19:50", notes: "Requires Table Combination" },
];

export const INITIAL_ORDERS = [
  {
    id: 501,
    customerId: 104,
    tableId: 3,
    priority: 3,
    priorityLabel: "Dine-In",
    status: 1,
    statusLabel: "Preparing",
    items: ["Smoked Black Truffle Risotto", "Wagyu A5 Ribeye", "Château Margaux 2015"],
    etaMinutes: 18,
    stationId: 1
  },
  {
    id: 502,
    customerId: 108,
    tableId: 5,
    priority: 3,
    priorityLabel: "Dine-In",
    status: 2,
    statusLabel: "Ready",
    items: ["Oscietra Caviar Brioche", "Butter Poached Turbot", "Vintage Champagne"],
    etaMinutes: 4,
    stationId: 4
  },
  {
    id: 503,
    customerId: 109,
    tableId: 0,
    priority: 2,
    priorityLabel: "Takeaway",
    status: 0,
    statusLabel: "Received",
    items: ["Dark Chocolate Obsidian Sphere", "Gold Leaf Espresso"],
    etaMinutes: 12,
    stationId: 5
  },
];

export const INITIAL_STATIONS = [
  { id: 1, name: "Grill & Flame Hearth", available: false, currentTask: "Wagyu A5 Sear (Order #501)", estRemaining: 14 },
  { id: 2, name: "Fryer & Confit Artisan", available: true, currentTask: "Idle / Ready", estRemaining: 0 },
  { id: 3, name: "Baking Vault & Stone Oven", available: true, currentTask: "Brioche Rested", estRemaining: 0 },
  { id: 4, name: "Salad & Cold Oscietra Prep", available: false, currentTask: "Caviar Garnish (Order #502)", estRemaining: 4 },
  { id: 5, name: "Bar & Vintage Sommelier", available: true, currentTask: "Decanting Margaux 2015", estRemaining: 0 },
];

export const INITIAL_METRICS = {
  totalCustomersArrived: 18,
  totalCustomersSeated: 14,
  totalOrdersPlaced: 15,
  totalOrdersCompleted: 12,
  averageWaitTimeMinutes: 4.8,
  revenueTodayFormatted: "$14,850",
};
