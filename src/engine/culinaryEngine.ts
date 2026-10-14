import { GameState, CulinaryLabSystem, RdRecipeProject, MenuItem } from '../types/game';
import { soundEngine } from './soundEngine';

export const INITIAL_CULINARY_PROJECTS: RdRecipeProject[] = [
  {
    id: 'rd_geisha_coffee',
    name: 'Golden Geisha Siphon Coffee',
    vietnameseName: 'Cà phê Siphon Geisha Hoàng Gia',
    category: 'coffee',
    researchCost: 1200,
    durationHours: 12,
    hoursInvested: 0,
    isUnlocked: false,
    isResearching: false,
    baseCost: 3.2,
    sellingPrice: 18.0,
    qualityBonus: 28,
    popularityBonus: 35,
    flavorProfile: 'Floral Jasmine, Bergamot, Papaya notes brewed with precision halogen siphon',
    requiredIngredients: [
      { ingredientId: 'coffee_beans', amount: 2 },
      { ingredientId: 'milk', amount: 0.5 },
    ],
  },
  {
    id: 'rd_wagyu_burger',
    name: 'Truffle Wagyu Brioche Burger',
    vietnameseName: 'Burger Bò Wagyu Nấm Truffle Vàng',
    category: 'main_dish',
    researchCost: 2200,
    durationHours: 18,
    hoursInvested: 0,
    isUnlocked: false,
    isResearching: false,
    baseCost: 5.8,
    sellingPrice: 29.5,
    qualityBonus: 35,
    popularityBonus: 45,
    flavorProfile: 'A5 Miyazaki Wagyu patty, black winter truffle aioli, toasted artisan brioche',
    requiredIngredients: [
      { ingredientId: 'beef_patty', amount: 2 },
      { ingredientId: 'artisan_buns', amount: 1 },
      { ingredientId: 'cheddar_cheese', amount: 1 },
      { ingredientId: 'special_sauce', amount: 2 },
    ],
  },
  {
    id: 'rd_lava_souffle',
    name: 'Matcha Gold Lava Soufflé',
    vietnameseName: 'Bánh Soufflé Matcha Dát Vàng',
    category: 'dessert',
    researchCost: 1600,
    durationHours: 14,
    hoursInvested: 0,
    isUnlocked: false,
    isResearching: false,
    baseCost: 2.8,
    sellingPrice: 16.5,
    qualityBonus: 30,
    popularityBonus: 40,
    flavorProfile: 'Ceremonial Uji matcha molten core, 24k edible gold leaf, Madagascar vanilla',
    requiredIngredients: [
      { ingredientId: 'matcha_powder', amount: 2 },
      { ingredientId: 'milk', amount: 1 },
    ],
  },
  {
    id: 'rd_caviar_salmon',
    name: 'Sous-Vide Salmon & Royal Caviar',
    vietnameseName: 'Cá Hồi Sous-Vide Trứng Cá Tầm',
    category: 'main_dish',
    researchCost: 2800,
    durationHours: 24,
    hoursInvested: 0,
    isUnlocked: false,
    isResearching: false,
    baseCost: 6.5,
    sellingPrice: 34.0,
    qualityBonus: 40,
    popularityBonus: 50,
    flavorProfile: 'Slow-cooked Norwegian wild salmon at 48°C, Ossetra caviar, dill emulsified beurre blanc',
    requiredIngredients: [
      { ingredientId: 'beef_patty', amount: 1 },
      { ingredientId: 'special_sauce', amount: 2 },
      { ingredientId: 'salad_greens', amount: 2 },
    ],
  },
  {
    id: 'rd_nitrogen_boba',
    name: 'Liquid Nitrogen Dragon Sparkler',
    vietnameseName: 'Trà Sữa Ni-tơ Long Châu Băng Tuyết',
    category: 'tea_beverage',
    researchCost: 1400,
    durationHours: 10,
    hoursInvested: 0,
    isUnlocked: false,
    isResearching: false,
    baseCost: 2.4,
    sellingPrice: 13.5,
    qualityBonus: 25,
    popularityBonus: 48,
    flavorProfile: 'Red dragonfruit infusion, cryogenic nitrogen smoke bubble, honey crystal boba pearls',
    requiredIngredients: [
      { ingredientId: 'tea_leaves', amount: 2 },
      { ingredientId: 'tapioca_pearls', amount: 2 },
      { ingredientId: 'milk', amount: 1 },
    ],
  },
];

export const INITIAL_CULINARY_SYSTEM: CulinaryLabSystem = {
  isLabEquipped: false,
  labTier: 1,
  labEfficiencyBonus: 0,
  activeProjectId: null,
  projects: INITIAL_CULINARY_PROJECTS,
  michelin: {
    stars: 0,
    lastInspectionDay: 0,
    inspectorPending: false,
    auditScore: 0,
    feedbackReport: 'No official Michelin inspection conducted yet. Train master chefs and elevate cleanliness to qualify.',
  },
  masterChefCount: 0,
};

export function advanceCulinaryTick(state: GameState, deltaHours: number): GameState {
  if (!state.culinaryLab.activeProjectId) return state;

  const activeProject = state.culinaryLab.projects.find(p => p.id === state.culinaryLab.activeProjectId);
  if (!activeProject || activeProject.isUnlocked) return state;

  // Head chef skill and lab tier boosts R&D speed
  const headChef = state.staff.find(s => s.role === 'head_chef');
  const chefMultiplier = headChef ? 1 + (headChef.experienceLevel - 1) * 0.25 + (headChef.accuracy / 200) : 1;
  const labMultiplier = 1 + (state.culinaryLab.labTier - 1) * 0.35 + state.culinaryLab.labEfficiencyBonus / 100;
  const effectiveHours = deltaHours * chefMultiplier * labMultiplier;

  const newInvested = activeProject.hoursInvested + effectiveHours;

  if (newInvested >= activeProject.durationHours) {
    // Project complete!
    soundEngine.playKitchenBell();
    
    // Add or activate as a signature menu item
    const existingMenuIdx = state.menu.findIndex(m => m.id === activeProject.id);
    let updatedMenu = [...state.menu];
    
    const newMenuItem: MenuItem = {
      id: activeProject.id,
      name: `★ ${activeProject.name}`,
      category: activeProject.category,
      baseCost: activeProject.baseCost,
      sellingPrice: activeProject.sellingPrice,
      prepTimeSeconds: 16,
      difficulty: 4,
      quality: 95 + activeProject.qualityBonus / 5,
      popularity: 80 + activeProject.popularityBonus / 5,
      active: true,
      requiredIngredients: activeProject.requiredIngredients,
      totalSoldToday: 0,
      totalRevenueToday: 0,
    };

    if (existingMenuIdx >= 0) {
      updatedMenu[existingMenuIdx] = newMenuItem;
    } else {
      updatedMenu.push(newMenuItem);
    }

    return {
      ...state,
      menu: updatedMenu,
      reputation: Math.min(100, state.reputation + 8),
      brandAwareness: Math.min(100, state.brandAwareness + 12),
      culinaryLab: {
        ...state.culinaryLab,
        activeProjectId: null,
        projects: state.culinaryLab.projects.map(p =>
          p.id === activeProject.id
            ? { ...p, hoursInvested: p.durationHours, isUnlocked: true, isResearching: false }
            : p
        ),
      },
    };
  }

  return {
    ...state,
    culinaryLab: {
      ...state.culinaryLab,
      projects: state.culinaryLab.projects.map(p =>
        p.id === activeProject.id ? { ...p, hoursInvested: newInvested } : p
      ),
    },
  };
}

export function evaluateMichelinAudit(state: GameState): { stars: 0 | 1 | 2 | 3; score: number; report: string } {
  const avgFoodQuality = state.menu.reduce((sum, item) => sum + item.quality, 0) / Math.max(1, state.menu.length);
  const cleanliness = state.cleanliness;
  const throughputEfficiency = state.ordersServedToday / Math.max(1, state.ordersServedToday + state.customersLostToday);
  const headChef = state.staff.find(s => s.role === 'head_chef');
  const chefScore = headChef ? (headChef.experienceLevel * 15 + headChef.accuracy * 0.25) : 30;

  // Weighted score (0 to 100)
  const score = Math.round(
    avgFoodQuality * 0.35 +
    cleanliness * 0.25 +
    (throughputEfficiency * 100) * 0.20 +
    chefScore * 0.20
  );

  let stars: 0 | 1 | 2 | 3 = 0;
  let report = '';

  if (score >= 92 && state.reputation >= 88 && (headChef?.experienceLevel ?? 0) >= 4) {
    stars = 3;
    report = 'Exceptional gastronomy, exquisite culinary artistry, sublime service choreography. Worth a special global voyage!';
  } else if (score >= 82 && state.reputation >= 80) {
    stars = 2;
    report = 'Masterful cooking, distinct culinary personality, and elevated ingredient pedigree. Worth a deliberate detour!';
  } else if (score >= 72 && state.reputation >= 70) {
    stars = 1;
    report = 'High-quality ingredients, harmonious flavors, and reliable consistency across seatings. A true culinary stop!';
  } else {
    stars = 0;
    report = `Audit score (${score}/100) fell short of the 72-point minimum guide threshold. Elevate menu quality and kitchen hygiene before reapplying.`;
  }

  return { stars, score, report };
}
