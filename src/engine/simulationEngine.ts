import { Customer, GameState, StaffMember, WeatherType } from '../types/game';
import { INITIAL_DISTRICTS } from '../data/initialData';
import { checkAndTriggerRandomEvents } from './eventsEngine';
import { soundEngine } from './soundEngine';
import { processDeliveryTick } from './deliveryEngine';
import { advanceCulinaryTick } from './culinaryEngine';
import { processDailySettlement } from './dailySettlementEngine';
import { getTableSeatTransform } from '../scene/seatingPositions';
import { getQueuePosition } from '../scene/queuePositions';

const NAMES_FIRST = ['Alex', 'Emma', 'Liam', 'Sophia', 'Lucas', 'Mia', 'Noah', 'Ava', 'Minh', 'Linh', 'Kenji', 'Chloe', 'David', 'Sarah'];
const NAMES_LAST = ['Tran', 'Nguyen', 'Smith', 'Johnson', 'Miller', 'Davis', 'Wong', 'Kim', 'Patel', 'Garcia'];

export function generateCustomer(id: string, acousticBonus: number = 0): Customer {
  const fName = NAMES_FIRST[Math.floor(Math.random() * NAMES_FIRST.length)];
  const lName = NAMES_LAST[Math.floor(Math.random() * NAMES_LAST.length)];
  const demos = ['student', 'office_worker', 'family', 'foodie', 'retiree'] as const;
  const demographic = demos[Math.floor(Math.random() * demos.length)];

  const patienceBase = demographic === 'student' ? 35 : demographic === 'office_worker' ? 24 : demographic === 'foodie' ? 40 : 30;

  return {
    id,
    name: `${fName} ${lName}`,
    demographic,
    budget: Math.floor(Math.random() * 25) + 10,
    patience: patienceBase + acousticBonus,
    waitingTime: 0,
    state: 'arriving',
    satisfaction: 100,
    spentAmount: 0,
    speed: 1.0 + (Math.random() * 0.4 - 0.2),
    x: (Math.random() * 4 - 2),
    z: 9 + Math.random() * 2,
    targetX: 0,
    targetZ: 1.5,
  };
}

export function advanceSimulationTick(prevState: GameState, deltaSec: number): GameState {
  if (prevState.gameSpeed === 0) return prevState;

  const speedMultiplier = prevState.gameSpeed;
  // 1 real second at 1x = 0.08 in-game hours (1 full in-game day = ~5 real minutes)
  const hoursElapsed = (deltaSec * speedMultiplier * 0.06);

  let timeHour = prevState.timeHour + hoursElapsed;
  let currentDay = prevState.currentDay;
  let isNewDay = false;

  if (timeHour >= 24) {
    timeHour = timeHour % 24;
    currentDay += 1;
    isNewDay = true;
  }

  // Copy state
  const state: GameState = {
    ...prevState,
    timeHour,
    currentDay,
    finances: {
      ...prevState.finances,
      dailyHistory: [...prevState.finances.dailyHistory],
    },
    menu: prevState.menu.map(m => ({ ...m })),
    inventory: prevState.inventory.map(i => ({ ...i })),
    staff: prevState.staff.map(s => ({ ...s })),
    applicants: [...prevState.applicants],
    equipment: prevState.equipment.map(e => ({ ...e })),
    tables: prevState.tables.map(t => ({ ...t, currentCustomerIds: [...t.currentCustomerIds] })),
    customers: prevState.customers.map(c => ({ ...c })),
    marketing: prevState.marketing.map(m => ({ ...m })),
    competitors: prevState.competitors.map(c => ({ ...c })),
    activeEvents: prevState.activeEvents.map(e => ({ ...e })),
  };

  // Weather check (changes occasionally)
  if (Math.random() < 0.003 * speedMultiplier) {
    const weathers: WeatherType[] = ['sunny', 'sunny', 'cloudy', 'rain', 'heavy_rain', 'heatwave'];
    state.weather = weathers[Math.floor(Math.random() * weathers.length)];
    soundEngine.setWeatherState(state.weather);
  }

  // Event check
  const newEvt = checkAndTriggerRandomEvents(state);
  if (newEvt) {
    state.activeEvents.push(newEvt);
  }

  // Progress active events
  state.activeEvents = state.activeEvents.filter(evt => {
    evt.durationHours -= hoursElapsed;
    return evt.durationHours > 0;
  });

  // Calculate Foot Traffic & Demand Curve
  const districtInfo = state.districts[state.currentDistrict] || INITIAL_DISTRICTS.residential;
  let timeMultiplier = 0.3; // base midnight
  if (timeHour >= 6.5 && timeHour < 9.5) timeMultiplier = 1.6; // Morning coffee rush
  else if (timeHour >= 9.5 && timeHour < 11.5) timeMultiplier = 0.85; // Mid-morning
  else if (timeHour >= 11.5 && timeHour < 14.0) timeMultiplier = 2.2; // Lunch Rush!
  else if (timeHour >= 14.0 && timeHour < 17.0) timeMultiplier = 0.9; // Afternoon lull
  else if (timeHour >= 17.0 && timeHour < 20.5) timeMultiplier = 1.9; // Dinner peak
  else if (timeHour >= 20.5 && timeHour < 23.0) timeMultiplier = 0.7; // Late evening

  // Marketing boost
  let marketingBoost = 1.0;
  state.marketing.forEach(m => {
    if (m.active) marketingBoost += m.trafficBoostPercentage / 100;
  });

  // Weather modifier
  let weatherModifier = 1.0;
  if (state.weather === 'rain') weatherModifier = 0.8;
  if (state.weather === 'heavy_rain') weatherModifier = 0.6;
  if (state.weather === 'heatwave') weatherModifier = 1.15;

  const reputationFactor = (state.reputation / 100) * 0.8 + 0.6;
  const currentDemand = Math.round(
    25 * districtInfo.footTrafficMultiplier * timeMultiplier * marketingBoost * weatherModifier * reputationFactor
  );
  state.currentHourDemand = currentDemand;

  // Kitchen & Barista Operational Capacity
  const activeChefs = state.staff.filter(s => s.role === 'head_chef' || s.role === 'line_cook' || s.role === 'prep_cook');
  const activeBaristas = state.staff.filter(s => s.role === 'barista' || s.role === 'cashier');
  
  const staffCookEfficiency = activeChefs.reduce((sum, c) => sum + (c.speed * c.stamina) / 10000, 0);
  const staffBeverageEfficiency = activeBaristas.reduce((sum, b) => sum + (b.speed * b.stamina) / 10000, 0);

  const equipCookingCap = state.equipment.filter(e => e.type === 'cooking_range' || e.type === 'prep_station')
    .reduce((sum, e) => sum + e.capacityPerMin * 60, 0) || 30;
  const equipDrinkCap = state.equipment.filter(e => e.type === 'espresso_machine')
    .reduce((sum, e) => sum + e.capacityPerMin * 60, 0) || 40;

  const totalCapacity = Math.round(
    (equipCookingCap * (0.4 + staffCookEfficiency * 0.8) + equipDrinkCap * (0.4 + staffBeverageEfficiency * 0.8)) / 2
  );
  state.kitchenCapacityPerHour = Math.max(15, totalCapacity);

  // Customer Spawning Logic
  const maxActiveCustomers = Math.min(18, state.tables.reduce((sum, t) => sum + t.seats, 0) + 4);
  const currentCustomerCount = state.customers.length;

  if (currentCustomerCount < maxActiveCustomers && Math.random() < (currentDemand / 40) * deltaSec * speedMultiplier) {
    const acousticBonus = state.layoutSettings.acousticWallPanels ? 10 : 0;
    const newCust = generateCustomer(`cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, acousticBonus);
    state.customers.push(newCust);
  }

  // Update Customer Behaviors & Order Fulfillment
  const updatedCustomers: Customer[] = [];

  for (let cust of state.customers) {
    cust.waitingTime += deltaSec * speedMultiplier;

    // State 1: Arriving or Queueing -> Finding Table / Advancing in Queue
    if (cust.state === 'arriving' || cust.state === 'queueing') {
      const availableTable = state.tables.find(t => !t.occupied);
      if (availableTable) {
        availableTable.occupied = true;
        availableTable.currentCustomerIds.push(cust.id);
        cust.assignedTableId = availableTable.id;
        cust.assignedSeatIndex = 0;
        const seatTransform = getTableSeatTransform(availableTable, 0);
        cust.state = 'seated';
        cust.targetX = seatTransform.x;
        cust.targetZ = seatTransform.z;
        cust.rotationY = seatTransform.rotationY;
      } else {
        cust.state = 'queueing';
      }
    }

    // State 2: Seated or Queueing -> Ordering
    if ((cust.state === 'seated' || cust.state === 'queueing') && !cust.orderedItemId) {
      const activeMenuItems = state.menu.filter(m => m.active);
      if (activeMenuItems.length > 0) {
        const chosen = activeMenuItems[Math.floor(Math.random() * activeMenuItems.length)];
        // Check if ingredients in stock
        const hasIngredients = chosen.requiredIngredients.every(req => {
          const inv = state.inventory.find(i => i.id === req.ingredientId);
          return inv && inv.stock >= req.amount;
        });

        if (hasIngredients) {
          cust.orderedItemId = chosen.id;
          cust.state = 'waiting_food';
          state.ordersPending += 1;

          // Consume ingredients with commissary bulk discount
          const cogsDiscount = state.commissary.isUnlocked ? (1 - state.commissary.cogsReductionPct / 100) : 1.0;
          chosen.requiredIngredients.forEach(req => {
            const inv = state.inventory.find(i => i.id === req.ingredientId);
            if (inv) {
              inv.stock = Math.max(0, inv.stock - req.amount);
              state.finances.cogsToday += req.amount * inv.unitCost * cogsDiscount;
            }
          });
        }
      }
    }

    // State 3: Waiting Food -> Cooking Finished
    if (cust.state === 'waiting_food') {
      // Prep time is accelerated by kitchen capacity and layout ergonomics
      const proximityFactor = state.layoutSettings.kitchenProximityTier === 1 ? 1.15 : state.layoutSettings.kitchenProximityTier === 2 ? 0.95 : 0.8;
      const expressFactor = state.layoutSettings.expressPickupWindow ? 1.1 : 1.0;
      const prepSpeedup = (state.kitchenCapacityPerHour / 38) * proximityFactor * expressFactor;
      const effectiveWait = cust.waitingTime * prepSpeedup;

      if (effectiveWait >= 18) {
        // Food is ready!
        cust.state = 'eating';
        state.ordersPending = Math.max(0, state.ordersPending - 1);
        state.ordersServedToday += 1;

        const menuItem = state.menu.find(m => m.id === cust.orderedItemId);
        if (menuItem) {
          menuItem.totalSoldToday += 1;
          menuItem.totalRevenueToday += menuItem.sellingPrice;
          cust.spentAmount = menuItem.sellingPrice;

          state.finances.cash += menuItem.sellingPrice;
          state.finances.revenueToday += menuItem.sellingPrice;

          soundEngine.playCashRegister();
        }
      } else if (cust.waitingTime > cust.patience) {
        // Impatient customer leaves angry!
        cust.state = 'leaving_angry';
        cust.satisfaction = 20;
        state.customersLostToday += 1;
        state.ordersPending = Math.max(0, state.ordersPending - 1);
        state.reputation = Math.max(10, state.reputation - 0.5);
      }
    }

    // State 4: Eating -> Finish and Leave Happy
    if (cust.state === 'eating') {
      if (cust.waitingTime >= 28) {
        cust.state = 'leaving_happy';
        cust.satisfaction = 95;
        state.reputation = Math.min(100, state.reputation + 0.15);
        state.brandAwareness = Math.min(100, state.brandAwareness + 0.1);
      }
    }

    // State 5: Leaving
    if (cust.state === 'leaving_happy' || cust.state === 'leaving_angry') {
      // Free table if occupied
      if (cust.assignedTableId) {
        const tbl = state.tables.find(t => t.id === cust.assignedTableId);
        if (tbl) {
          tbl.occupied = false;
          tbl.currentCustomerIds = tbl.currentCustomerIds.filter(id => id !== cust.id);
        }
      }
      // Customer walks away towards street exit
      cust.targetX = 0;
      cust.targetZ = 12;
      if (cust.waitingTime > 36 || cust.z > 9.5) {
        // despawn customer
        continue;
      }
    }

    updatedCustomers.push(cust);
  }

  // Assign distinct spaced queue slots along open aisle to all queueing patrons
  const queueingPatrons = updatedCustomers.filter(c => c.state === 'queueing');
  queueingPatrons.forEach((qCust, idx) => {
    const slot = getQueuePosition(idx);
    qCust.targetX = slot.x;
    qCust.targetZ = slot.z;
    qCust.rotationY = slot.rotationY;
  });

  state.customers = updatedCustomers;

  // Phase 2: Process Online Delivery Orders Tick
  processDeliveryTick(state, deltaSec);

  // Staff Fatigue & Shift logic
  state.staff.forEach(s => {
    if (s.isWorking) {
      if (state.ordersPending > 3) {
        s.stress = Math.min(100, s.stress + 0.05 * speedMultiplier);
        s.stamina = Math.max(20, s.stamina - 0.04 * speedMultiplier);
      } else {
        s.stress = Math.max(0, s.stress - 0.02 * speedMultiplier);
      }
    }
    // Training progress
    if (s.trainingInProgress) {
      s.trainingInProgress.progress += 0.8 * speedMultiplier;
      if (s.trainingInProgress.progress >= 100) {
        const type = s.trainingInProgress.type;
        s[type] = Math.min(100, s[type] + 8);
        s.trainingInProgress = undefined;
      }
    }
  });

  // Phase 5: Advance Culinary R&D Research Tick
  const stateWithCulinary = advanceCulinaryTick(state, hoursElapsed);

  // End of Day Settlement Logic
  if (isNewDay) {
    processDailySettlement(stateWithCulinary, currentDay);
    refreshApplicants(stateWithCulinary);
  }

  return stateWithCulinary;
}

function refreshApplicants(state: GameState) {
  const roles = ['line_cook', 'barista', 'server', 'cashier', 'prep_cook'] as const;
  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
  const personalities = ['Passionate & Quick', 'Calm Under Stress', 'Perfectionist', 'Friendly & Welcoming', 'High Stamina'];

  state.applicants = [
    {
      id: `app_${Date.now()}_1`,
      name: `${NAMES_FIRST[Math.floor(Math.random() * NAMES_FIRST.length)]} ${NAMES_LAST[Math.floor(Math.random() * NAMES_LAST.length)]}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      expectedSalary: Math.floor(Math.random() * 30) + 45,
      experienceLevel: Math.floor(Math.random() * 3) + 1,
      speed: Math.floor(Math.random() * 35) + 55,
      accuracy: Math.floor(Math.random() * 35) + 55,
      hospitality: Math.floor(Math.random() * 35) + 60,
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      id: `app_${Date.now()}_2`,
      name: `${NAMES_FIRST[Math.floor(Math.random() * NAMES_FIRST.length)]} ${NAMES_LAST[Math.floor(Math.random() * NAMES_LAST.length)]}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      expectedSalary: Math.floor(Math.random() * 40) + 60,
      experienceLevel: Math.floor(Math.random() * 3) + 2,
      speed: Math.floor(Math.random() * 30) + 65,
      accuracy: Math.floor(Math.random() * 30) + 65,
      hospitality: Math.floor(Math.random() * 30) + 65,
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    },
  ];
}
