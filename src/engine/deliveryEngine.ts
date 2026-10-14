import { DeliveryOrder, GameState } from '../types/game';
import { soundEngine } from './soundEngine';

const DELIVERY_CUSTOMER_NAMES = ['Oliver Queen', 'Jessica Jones', 'Bruce Wayne', 'Diana Prince', 'Peter Parker', 'Barry Allen', 'Clark Kent', 'Tony Stark', 'Natasha Romanoff', 'Steve Rogers'];

export function processDeliveryTick(state: GameState, deltaSec: number): void {
  const activePlatforms = state.deliveryPlatforms.filter(p => p.active);
  if (activePlatforms.length === 0) return;

  const speed = state.gameSpeed;
  if (speed === 0) return;

  // Weather modifier: Rain drastically boosts online delivery demand
  let weatherDeliveryMod = 1.0;
  if (state.weather === 'rain') weatherDeliveryMod = 1.7;
  if (state.weather === 'heavy_rain') weatherDeliveryMod = 2.4;
  if (state.weather === 'heatwave') weatherDeliveryMod = 1.3;

  // Spawning new online delivery orders
  const spawnChance = (activePlatforms.length * 0.15 * weatherDeliveryMod * (state.reputation / 80)) * deltaSec * speed;
  if (state.activeDeliveryOrders.length < 8 && Math.random() < spawnChance) {
    const platform = activePlatforms[Math.floor(Math.random() * activePlatforms.length)];
    const activeDishes = state.menu.filter(m => m.active);

    if (activeDishes.length > 0) {
      const chosenDish = activeDishes[Math.floor(Math.random() * activeDishes.length)];
      const custName = DELIVERY_CUSTOMER_NAMES[Math.floor(Math.random() * DELIVERY_CUSTOMER_NAMES.length)];

      const newOrder: DeliveryOrder = {
        id: `deliv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        customerName: custName,
        menuItemId: chosenDish.id,
        menuItemName: chosenDish.name,
        price: chosenDish.sellingPrice,
        status: 'preparing',
        appSource: platform.name,
        timeElapsed: 0,
        timeLimit: Math.floor(Math.random() * 20) + 35, // 35 - 55 seconds
        tip: Math.random() < 0.4 ? Math.floor(Math.random() * 3) + 1 : 0,
      };

      state.activeDeliveryOrders.push(newOrder);

      // Deduct ingredients & add to kitchen load
      chosenDish.requiredIngredients.forEach(req => {
        const inv = state.inventory.find(i => i.id === req.ingredientId);
        if (inv) {
          inv.stock = Math.max(0, inv.stock - req.amount);
          state.finances.cogsToday += req.amount * inv.unitCost;
        }
      });
      state.ordersPending += 1;
    }
  }

  // Progress active delivery orders
  const updatedOrders: DeliveryOrder[] = [];
  for (let order of state.activeDeliveryOrders) {
    order.timeElapsed += deltaSec * speed;

    // Kitchen prep speed accelerated by kitchen capacity
    const prepFactor = state.kitchenCapacityPerHour / 35;

    if (order.status === 'preparing') {
      if (order.timeElapsed * prepFactor >= 12) {
        order.status = 'ready_pickup';
        state.ordersPending = Math.max(0, state.ordersPending - 1);
        soundEngine.playOrderBell();
      }
    } else if (order.status === 'ready_pickup') {
      // Driver arrival (faster if player owns delivery scooters)
      const driverSpeedup = state.ownedScooters > 0 ? 1.5 : 1.0;
      if (order.timeElapsed * driverSpeedup >= 20) {
        order.status = 'delivering';
      }
    } else if (order.status === 'delivering') {
      if (order.timeElapsed >= 32) {
        order.status = 'delivered';

        // Payout settlement: Price minus platform commission plus tip
        const platform = state.deliveryPlatforms.find(p => p.name === order.appSource);
        const commissionPct = platform ? platform.commissionPct : 20;
        const netRevenue = Number((order.price * (1 - commissionPct / 100) + order.tip).toFixed(2));

        state.finances.cash += netRevenue;
        state.finances.revenueToday += netRevenue;
        state.deliveredOrdersToday += 1;
        state.deliveryRevenueToday += netRevenue;

        soundEngine.playCashRegister();
        // Completed delivery, skip adding to updated active list
        continue;
      }
    }

    // Check if order took too long (impatient delivery customer canceled)
    if (order.timeElapsed > order.timeLimit) {
      state.customersLostToday += 1;
      state.reputation = Math.max(10, state.reputation - 0.4);
      continue;
    }

    updatedOrders.push(order);
  }

  state.activeDeliveryOrders = updatedOrders;
}
