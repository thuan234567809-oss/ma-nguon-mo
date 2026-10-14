import { GameState } from '../types/game';
import { updateCorporateDailyTick } from './corporateEngine';

export function processDailySettlement(state: GameState, currentDay: number): void {
  const districtInfo = state.districts[state.currentDistrict];
  const rent = districtInfo.baseRent;
  const payroll = state.staff.reduce((sum, s) => sum + s.salary, 0);
  const utilities = 35 + (state.equipment.length * 8) + (state.tables.length * 4);
  const marketingCost = state.marketing.filter(m => m.active).reduce((sum, m) => sum + m.dailyCost, 0);
  const maintenance = state.equipment.reduce((sum, e) => sum + (100 - e.condition) * 0.2, 0);

  const commissaryCost = state.commissary?.isUnlocked ? state.commissary.dailyOperatingCost : 0;
  const branchNetProfits = (state.branches || [])
    .filter(b => b.status === 'operational' && b.id !== 'branch_hq')
    .reduce((sum, b) => sum + b.dailyProfit, 0);

  // Michelin star boosts customer average spending across branches
  const michelinBonus = state.culinaryLab?.michelin?.stars ? state.culinaryLab.michelin.stars * 120 : 0;

  const totalExpenses = state.finances.cogsToday + rent + payroll + utilities + marketingCost + maintenance + commissaryCost;
  const netProfitToday = state.finances.revenueToday - totalExpenses + branchNetProfits + michelinBonus;

  state.finances.rentToday = rent;
  state.finances.payrollToday = payroll;
  state.finances.utilitiesToday = utilities;
  state.finances.marketingToday = marketingCost;
  state.finances.maintenanceToday = maintenance;
  state.finances.netProfitToday = netProfitToday;

  // Deduct expenses and credit branch profits & michelin bonus
  state.finances.cash -= (rent + payroll + utilities + marketingCost + maintenance + commissaryCost);
  state.finances.cash += (branchNetProfits + michelinBonus);

  // Phase 3: Corporate tick (Valuation, Share Price, Franchise Royalties)
  updateCorporateDailyTick(state);

  // Bankruptcy Check (Emergency stop if debt exceeds limits)
  if (state.finances.cash < -2000) {
    state.isBankrupt = true;
  }

  // Record in history
  state.finances.dailyHistory.push({
    day: currentDay - 1,
    revenue: Math.round(state.finances.revenueToday),
    cogs: Math.round(state.finances.cogsToday),
    netProfit: Math.round(netProfitToday),
    cash: Math.round(state.finances.cash),
    customerCount: state.ordersServedToday,
    avgSpend: state.ordersServedToday > 0 ? Number((state.finances.revenueToday / state.ordersServedToday).toFixed(2)) : 0,
  });

  // Reset daily counters
  state.finances.revenueToday = 0;
  state.finances.cogsToday = 0;
  state.ordersServedToday = 0;
  state.customersLostToday = 0;
  state.deliveredOrdersToday = 0;
  state.deliveryRevenueToday = 0;
  state.menu.forEach(m => {
    m.totalSoldToday = 0;
    m.totalRevenueToday = 0;
  });

  // Auto-reorder inventory if threshold reached
  state.inventory.forEach(inv => {
    if (inv.stock <= inv.autoReorderThreshold) {
      const orderQty = inv.autoReorderAmount;
      const discount = state.commissary?.isUnlocked ? (1 - state.commissary.cogsReductionPct / 100) : 1;
      const cost = orderQty * inv.unitCost * discount;
      if (state.finances.cash >= cost) {
        state.finances.cash -= cost;
        inv.stock = Math.min(inv.maxStock, inv.stock + orderQty);
      }
    }
  });

  // Cleanliness slight daily degradation
  state.cleanliness = Math.max(30, state.cleanliness - (state.staff.some(s => s.role === 'cleaner') ? 2 : 7));
}
