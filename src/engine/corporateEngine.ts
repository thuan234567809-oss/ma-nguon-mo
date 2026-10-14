import { CorporateSystem, FranchiseSystem, FranchiseeUnit, GameState } from '../types/game';

export function calculateEnterpriseValuation(state: GameState): number {
  // Annualized base revenue from HQ + branches + delivery
  const dailyBaseRevenue = state.finances.revenueToday || 1200;
  const branchDailyRev = state.branches
    .filter(b => b.status === 'operational')
    .reduce((sum, b) => sum + b.dailyRevenue, 0);

  const franchiseDailyRev = state.franchise.units
    .filter(u => u.status === 'active')
    .reduce((sum, u) => sum + u.dailyGrossRevenue, 0);

  const totalDailyNetworkRevenue = dailyBaseRevenue + branchDailyRev + franchiseDailyRev;
  const annualizedRevenue = totalDailyNetworkRevenue * 300;

  // Multiples based on reputation, brand awareness and commissary
  let multiple = 1.8;
  if (state.reputation > 85) multiple += 0.8;
  if (state.brandAwareness > 50) multiple += 0.6;
  if (state.commissary.isUnlocked) multiple += 0.5;
  if (state.corporate.isHoldingsFormed) multiple += 0.7;

  // Assets (cash + equipment + owned scooters)
  const physicalAssets = state.finances.cash + state.equipment.length * 1500 + state.ownedScooters * 450;

  const valuation = Math.round(annualizedRevenue * multiple + physicalAssets);
  return Math.max(25000, valuation);
}

export function updateCorporateDailyTick(state: GameState): void {
  // Update valuation
  const valuation = calculateEnterpriseValuation(state);
  state.corporate.enterpriseValuation = valuation;

  // If IPO listed, update share price
  if (state.corporate.isIpoListed && state.corporate.sharesOutstanding > 0) {
    const rawPrice = valuation / state.corporate.sharesOutstanding;
    state.corporate.sharePrice = Number(rawPrice.toFixed(2));
  }

  // Settle Franchise Royalties (6% collected nightly)
  if (state.franchise.isUnlocked && state.franchise.units.length > 0) {
    let totalRoyaltiesToday = 0;
    state.franchise.units.forEach(unit => {
      // Slight drift in audit score
      if (Math.random() < 0.2) {
        unit.auditScore = Math.max(40, Math.min(100, unit.auditScore + (Math.random() * 6 - 3)));
        unit.status = unit.auditScore < 60 ? 'warning' : 'active';
      }

      if (unit.status !== 'terminated') {
        // Daily gross fluctuates around $650 - $1100 based on parent brand reputation
        const repFactor = state.reputation / 75;
        unit.dailyGrossRevenue = Math.round((750 + Math.random() * 350) * repFactor);
        const royalty = Math.round(unit.dailyGrossRevenue * (state.franchise.royaltyPct / 100));
        unit.dailyRoyaltyFee = royalty;
        totalRoyaltiesToday += royalty;
      }
    });

    state.finances.cash += totalRoyaltiesToday;
    state.finances.revenueToday += totalRoyaltiesToday;
  }
}

export function generateCandidateFranchisee(state: GameState): FranchiseeUnit {
  const names = ['Michael Vance', 'Chloe Dubois', 'Kenji Sato', 'Amira Hassan', 'David Thorne', 'Sophie Laurent'];
  const locations = ['North Gate Promenade', 'Harbor Marina View', 'Tech Valley Square', 'Eastside Arts District', 'Old Quarter Alley'];
  const distIds = ['residential', 'college', 'business', 'downtown', 'suburb'] as const;

  const ownerName = names[Math.floor(Math.random() * names.length)];
  const locationName = locations[Math.floor(Math.random() * locations.length)];
  const districtId = distIds[Math.floor(Math.random() * distIds.length)];

  return {
    id: `fran_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    ownerName,
    districtId,
    locationName,
    joinedDay: state.currentDay,
    dailyGrossRevenue: 850,
    dailyRoyaltyFee: 51,
    auditScore: 90,
    status: 'active',
  };
}
