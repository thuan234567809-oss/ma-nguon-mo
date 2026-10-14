export type GameSpeed = 0 | 1 | 2 | 5;

export type WeatherType = 'sunny' | 'cloudy' | 'rain' | 'heavy_rain' | 'heatwave' | 'cold_snap';

export type TimePeriod = 'morning' | 'lunch_rush' | 'afternoon' | 'dinner_rush' | 'late_night' | 'closed';

export type DistrictId = 'residential' | 'college' | 'business' | 'downtown' | 'suburb';

export type StaffRole = 'head_chef' | 'line_cook' | 'prep_cook' | 'barista' | 'cashier' | 'server' | 'cleaner' | 'shift_manager';

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  vietnameseName: string;
  description: string;
  baseRent: number;
  footTrafficMultiplier: number;
  averageIncome: 'low' | 'medium' | 'high' | 'luxury';
  targetAudience: string;
  unlocked: boolean;
  unlockCost: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  salary: number; // daily salary
  experienceLevel: number; // 1 to 5
  speed: number; // 0 to 100
  accuracy: number; // 0 to 100 (affects mistake / food burn rate)
  hospitality: number; // 0 to 100 (customer satisfaction)
  stamina: number; // 0 to 100
  stress: number; // 0 to 100 (high stress -> quit chance)
  satisfaction: number; // 0 to 100
  assignedShift: 'morning' | 'evening' | 'full';
  avatarColor: string;
  isWorking: boolean;
  trainingInProgress?: {
    type: 'speed' | 'accuracy' | 'hospitality';
    progress: number; // 0 to 100
  };
}

export interface Applicant {
  id: string;
  name: string;
  role: StaffRole;
  expectedSalary: number;
  experienceLevel: number;
  speed: number;
  accuracy: number;
  hospitality: number;
  personality: string;
  avatarColor: string;
}

export interface Ingredient {
  id: string;
  name: string;
  vietnameseName?: string;
  category: 'meat' | 'dairy' | 'produce' | 'beverage' | 'grain' | 'sauce';
  unitCost: number;
  stock: number;
  maxStock: number;
  qualityGrade: 'standard' | 'premium' | 'organic';
  spoilageDays: number;
  supplierDiscount: number;
  autoReorderThreshold: number;
  autoReorderAmount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  vietnameseName?: string;
  category: 'coffee' | 'tea_beverage' | 'main_dish' | 'quick_bites' | 'dessert';
  baseCost: number; // calculated from ingredients
  sellingPrice: number;
  prepTimeSeconds: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  quality: number; // 0 to 100
  popularity: number; // 0 to 100
  active: boolean;
  requiredIngredients: { ingredientId: string; amount: number }[];
  totalSoldToday: number;
  totalRevenueToday: number;
}

export interface Equipment {
  id: string;
  name: string;
  vietnameseName?: string;
  type: 'espresso_machine' | 'cooking_range' | 'deep_fryer' | 'prep_station' | 'pos_terminal' | 'refrigerated_display';
  tier: number;
  cost: number;
  capacityPerMin: number;
  reliability: number; // 0 to 100
  efficiencyBonus: number; // percentage speedup
  condition: number; // 0 to 100
}

export interface DiningTable {
  id: string;
  type: 'table_2p' | 'table_4p' | 'booth_6p' | 'counter_bar';
  seats: number;
  cost: number;
  ambianceBonus: number;
  x: number;
  z: number;
  occupied: boolean;
  currentCustomerIds: string[];
}

export interface Customer {
  id: string;
  name: string;
  demographic: 'student' | 'office_worker' | 'family' | 'foodie' | 'retiree';
  budget: number;
  patience: number; // max seconds willing to wait
  waitingTime: number; // seconds elapsed
  state: 'arriving' | 'queueing' | 'seated' | 'waiting_food' | 'eating' | 'leaving_happy' | 'leaving_angry';
  orderedItemId?: string;
  assignedTableId?: string;
  assignedSeatIndex?: number;
  rotationY?: number;
  satisfaction: number; // 0 to 100
  spentAmount: number;
  speed: number;
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
}

export interface FinancialRecord {
  cash: number;
  revenueToday: number;
  cogsToday: number;
  payrollToday: number;
  rentToday: number;
  utilitiesToday: number;
  marketingToday: number;
  maintenanceToday: number;
  netProfitToday: number;
  dailyHistory: {
    day: number;
    revenue: number;
    cogs: number;
    netProfit: number;
    cash: number;
    customerCount: number;
    avgSpend: number;
  }[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  vietnameseName?: string;
  type: 'social_ads' | 'influencer' | 'local_billboard' | 'happy_hour_promo' | 'loyalty_club';
  dailyCost: number;
  active: boolean;
  trafficBoostPercentage: number;
  awarenessBoost: number;
  durationDays: number;
  daysRemaining: number;
}

export interface Competitor {
  id: string;
  name: string;
  vietnameseName?: string;
  brandType: 'fast_food' | 'artisan_cafe' | 'bistro_chain' | 'budget_eatery';
  districtId: DistrictId;
  reputation: number;
  priceLevel: 'cheap' | 'moderate' | 'expensive';
  marketShare: number; // percentage
  marketingAggression: number;
}

export interface GameEvent {
  id: string;
  title: string;
  vietnameseTitle?: string;
  description: string;
  vietnameseDescription?: string;
  type: 'opportunity' | 'crisis' | 'market_shift';
  active: boolean;
  durationHours: number;
  impact: {
    trafficMultiplier?: number;
    ingredientCostMultiplier?: number;
    revenueMultiplier?: number;
    staffStressMultiplier?: number;
    reputationChange?: number;
  };
}

export interface InspectableEntity {
  type: 'customer' | 'staff' | 'equipment' | 'table' | 'competitor' | 'district_building';
  id: string;
  title: string;
  subtitle: string;
  stats: { label: string; value: string | number; color?: string }[];
  details?: string;
}

export interface DeliveryOrder {
  id: string;
  customerName: string;
  menuItemId: string;
  menuItemName: string;
  price: number;
  status: 'preparing' | 'ready_pickup' | 'delivering' | 'delivered';
  appSource: string;
  timeElapsed: number;
  timeLimit: number;
  tip: number;
}

export interface DeliveryPlatform {
  id: string;
  name: string;
  commissionPct: number;
  orderMultiplier: number;
  active: boolean;
}

export interface CommissarySystem {
  isUnlocked: boolean;
  tier: number; // 1 to 3
  dailyPrepCapacity: number;
  cogsReductionPct: number; // reduces recipe costs by 15-30%
  dailyOperatingCost: number;
}

export interface BranchLocation {
  id: string;
  districtId: DistrictId;
  name: string;
  status: 'operational' | 'expanding' | 'franchised';
  dailyRevenue: number;
  dailyProfit: number;
  staffCount: number;
}

export interface FranchiseeUnit {
  id: string;
  ownerName: string;
  districtId: DistrictId;
  locationName: string;
  joinedDay: number;
  dailyGrossRevenue: number;
  dailyRoyaltyFee: number;
  auditScore: number; // 0 to 100
  status: 'active' | 'warning' | 'terminated';
}

export interface FranchiseSystem {
  isUnlocked: boolean;
  initialFee: number;
  royaltyPct: number;
  units: FranchiseeUnit[];
  minReputationRequired: number;
}

export interface CorporateSystem {
  isHoldingsFormed: boolean;
  holdingCompanyName: string;
  enterpriseValuation: number;
  isIpoListed: boolean;
  tickerSymbol: string;
  sharePrice: number;
  sharesOutstanding: number;
  publicFloatPct: number;
  acquiredCompetitorIds: string[];
}

export interface RdRecipeProject {
  id: string;
  name: string;
  vietnameseName: string;
  category: 'coffee' | 'tea_beverage' | 'main_dish' | 'quick_bites' | 'dessert';
  researchCost: number;
  durationHours: number;
  hoursInvested: number;
  isUnlocked: boolean;
  isResearching: boolean;
  baseCost: number;
  sellingPrice: number;
  qualityBonus: number;
  popularityBonus: number;
  flavorProfile: string;
  requiredIngredients: { ingredientId: string; amount: number }[];
}

export interface MichelinStatus {
  stars: 0 | 1 | 2 | 3;
  lastInspectionDay: number;
  inspectorPending: boolean;
  auditScore: number;
  feedbackReport: string;
}

export interface CulinaryLabSystem {
  isLabEquipped: boolean;
  labTier: number; // 1 to 3
  labEfficiencyBonus: number;
  activeProjectId: string | null;
  projects: RdRecipeProject[];
  michelin: MichelinStatus;
  masterChefCount: number;
}

export interface GameState {
  companyName: string;
  currentDay: number;
  timeHour: number; // 0 to 24 (e.g. 8.5 is 8:30)
  gameSpeed: GameSpeed;
  weather: WeatherType;
  temperatureC: number;
  currentDistrict: DistrictId;
  reputation: number; // 0 to 100
  cleanliness: number; // 0 to 100
  brandAwareness: number; // 0 to 100
  
  // Systems
  finances: FinancialRecord;
  menu: MenuItem[];
  inventory: Ingredient[];
  staff: StaffMember[];
  applicants: Applicant[];
  equipment: Equipment[];
  tables: DiningTable[];
  customers: Customer[];
  marketing: MarketingCampaign[];
  competitors: Competitor[];
  districts: Record<DistrictId, DistrictInfo>;
  activeEvents: GameEvent[];
  
  // Phase 2: Delivery & Fleet System
  deliveryPlatforms: DeliveryPlatform[];
  activeDeliveryOrders: DeliveryOrder[];
  deliveredOrdersToday: number;
  deliveryRevenueToday: number;
  ownedScooters: number;

  // Phase 2: Central Commissary & Chain Network
  commissary: CommissarySystem;
  branches: BranchLocation[];

  // Phase 2: Layout Ergonomics
  layoutSettings: {
    kitchenProximityTier: number; // 1 (optimal 3m), 2 (5m), 3 (distant 8m)
    expressPickupWindow: boolean;
    acousticWallPanels: boolean;
  };

  // Phase 3: Corporate, Franchise & IPO System
  franchise: FranchiseSystem;
  corporate: CorporateSystem;
  isBankrupt: boolean;

  // Phase 5: Culinary R&D Lab & Michelin Stars System
  culinaryLab: CulinaryLabSystem;

  // Realtime Operations
  ordersPending: number;
  ordersServedToday: number;
  customersLostToday: number;
  kitchenCapacityPerHour: number;
  currentHourDemand: number;
  
  // Inspector
  selectedEntity: InspectableEntity | null;
}
