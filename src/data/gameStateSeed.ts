import { GameState } from '../types/game';
import { INITIAL_CULINARY_SYSTEM } from '../engine/culinaryEngine';
import {
  INITIAL_DISTRICTS,
  INITIAL_EQUIPMENT,
  INITIAL_INGREDIENTS,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_MARKETING,
  INITIAL_COMPETITORS,
  INITIAL_DELIVERY_PLATFORMS,
  INITIAL_COMMISSARY,
  INITIAL_BRANCHES,
} from './initialData';

export const INITIAL_GAME_STATE: GameState = {
  companyName: 'Bistro Lumière & Bar',
  currentDay: 1,
  timeHour: 8.0, // 08:00 AM morning
  gameSpeed: 1,
  weather: 'sunny',
  temperatureC: 26,
  currentDistrict: 'residential',
  reputation: 75,
  cleanliness: 90,
  brandAwareness: 30,

  finances: {
    cash: 3800,
    revenueToday: 0,
    cogsToday: 0,
    payrollToday: 0,
    rentToday: 0,
    utilitiesToday: 0,
    marketingToday: 0,
    maintenanceToday: 0,
    netProfitToday: 0,
    dailyHistory: [],
  },

  menu: INITIAL_MENU_ITEMS,
  inventory: INITIAL_INGREDIENTS,
  equipment: INITIAL_EQUIPMENT,
  tables: INITIAL_TABLES,
  marketing: INITIAL_MARKETING,
  competitors: INITIAL_COMPETITORS,
  districts: INITIAL_DISTRICTS,
  customers: [],
  activeEvents: [],

  // Phase 2: Delivery & Fleet System
  deliveryPlatforms: INITIAL_DELIVERY_PLATFORMS,
  activeDeliveryOrders: [],
  deliveredOrdersToday: 0,
  deliveryRevenueToday: 0,
  ownedScooters: 1,

  // Phase 2: Central Commissary & Chain Network
  commissary: INITIAL_COMMISSARY,
  branches: INITIAL_BRANCHES,

  // Phase 2: Layout Ergonomics
  layoutSettings: {
    kitchenProximityTier: 1,
    expressPickupWindow: true,
    acousticWallPanels: false,
  },

  // Phase 3: Corporate, Franchise & IPO System
  franchise: {
    isUnlocked: false,
    initialFee: 20000,
    royaltyPct: 6,
    units: [],
    minReputationRequired: 80,
  },
  corporate: {
    isHoldingsFormed: false,
    holdingCompanyName: 'Lumière Hospitality Group Inc.',
    enterpriseValuation: 65000,
    isIpoListed: false,
    tickerSymbol: 'BIST',
    sharePrice: 12.5,
    sharesOutstanding: 10000,
    publicFloatPct: 0,
    acquiredCompetitorIds: [],
  },
  isBankrupt: false,

  // Phase 5: Culinary R&D Lab & Michelin Stars System
  culinaryLab: INITIAL_CULINARY_SYSTEM,

  staff: [
    {
      id: 'staff_chef_1',
      name: 'Chef Antoine Vance',
      role: 'head_chef',
      salary: 85,
      experienceLevel: 4,
      speed: 78,
      accuracy: 85,
      hospitality: 70,
      stamina: 90,
      stress: 15,
      satisfaction: 92,
      assignedShift: 'morning',
      avatarColor: '#f59e0b',
      isWorking: true,
    },
    {
      id: 'staff_barista_1',
      name: 'Elena Rostova',
      role: 'barista',
      salary: 55,
      experienceLevel: 3,
      speed: 82,
      accuracy: 80,
      hospitality: 88,
      stamina: 85,
      stress: 20,
      satisfaction: 90,
      assignedShift: 'morning',
      avatarColor: '#3b82f6',
      isWorking: true,
    },
    {
      id: 'staff_server_1',
      name: 'Marcus Chen',
      role: 'server',
      salary: 45,
      experienceLevel: 2,
      speed: 75,
      accuracy: 75,
      hospitality: 92,
      stamina: 88,
      stress: 12,
      satisfaction: 95,
      assignedShift: 'morning',
      avatarColor: '#10b981',
      isWorking: true,
    },
  ],

  applicants: [
    {
      id: 'app_seed_1',
      name: 'Maya Lin',
      role: 'line_cook',
      expectedSalary: 60,
      experienceLevel: 2,
      speed: 74,
      accuracy: 72,
      hospitality: 65,
      personality: 'Energetic & Fast learner',
      avatarColor: '#ec4899',
    },
    {
      id: 'app_seed_2',
      name: 'Julian Ross',
      role: 'barista',
      expectedSalary: 52,
      experienceLevel: 3,
      speed: 80,
      accuracy: 78,
      hospitality: 85,
      personality: 'Latte Art Specialist',
      avatarColor: '#8b5cf6',
    },
  ],

  ordersPending: 0,
  ordersServedToday: 0,
  customersLostToday: 0,
  kitchenCapacityPerHour: 45,
  currentHourDemand: 30,

  selectedEntity: null,
};
