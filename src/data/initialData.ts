import { DistrictId, DistrictInfo, Equipment, Ingredient, MenuItem, MarketingCampaign, Competitor, DiningTable } from '../types/game';

export const INITIAL_DISTRICTS: Record<DistrictId, DistrictInfo> = {
  residential: {
    id: 'residential',
    name: 'Greenwood Quarters',
    vietnameseName: 'Khu Đô Thị Xanh',
    description: 'A cozy neighborhood with families, students, and regular loyal customers. Stable foot-traffic with evening dinner rushes.',
    baseRent: 120, // daily
    footTrafficMultiplier: 1.0,
    averageIncome: 'medium',
    targetAudience: 'Families, regulars & weekend brunch goers',
    unlocked: true,
    unlockCost: 0,
  },
  college: {
    id: 'college',
    name: 'University Boulevard',
    vietnameseName: 'Đại Lộ Đại Học',
    description: 'High foot-traffic of price-conscious students. Peak hours at morning coffee, 12:00 lunch rush and late-night study sessions.',
    baseRent: 190,
    footTrafficMultiplier: 1.45,
    averageIncome: 'low',
    targetAudience: 'University students, lecturers, youth',
    unlocked: false,
    unlockCost: 3500,
  },
  business: {
    id: 'business',
    name: 'FinTech Hub Plaza',
    vietnameseName: 'Khu Tài Chính & Công Nghệ',
    description: 'Dense corporate office towers. High willingness to spend on premium coffee, quick business lunches and team meetings.',
    baseRent: 350,
    footTrafficMultiplier: 1.8,
    averageIncome: 'high',
    targetAudience: 'Corporate executives, engineers, banking staff',
    unlocked: false,
    unlockCost: 7500,
  },
  downtown: {
    id: 'downtown',
    name: 'Grand Central Promenade',
    vietnameseName: 'Quảng Trường Trung Tâm',
    description: 'The golden epicenter of the metropolis. Huge foot traffic, prestigious brand visibility, tourists, high competition and exorbitant rent.',
    baseRent: 750,
    footTrafficMultiplier: 2.6,
    averageIncome: 'luxury',
    targetAudience: 'Tourists, affluent shoppers, influencers',
    unlocked: false,
    unlockCost: 15000,
  },
  suburb: {
    id: 'suburb',
    name: 'Sunset Highway Strip',
    vietnameseName: 'Trục Cao Tốc Ngoại Ô',
    description: 'Low overhead costs, large parking spaces, ideal for drive-thru, central production prep kitchen or budget family dining.',
    baseRent: 80,
    footTrafficMultiplier: 0.75,
    averageIncome: 'medium',
    targetAudience: 'Commuters, road trippers, bulk delivery hubs',
    unlocked: false,
    unlockCost: 2000,
  },
};

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'coffee_beans', name: 'Arabica Roast Beans', vietnameseName: 'Hạt Cà Phê Arabica Rang Đậm', category: 'beverage', unitCost: 1.2, stock: 120, maxStock: 250, qualityGrade: 'premium', spoilageDays: 45, supplierDiscount: 0, autoReorderThreshold: 30, autoReorderAmount: 80 },
  { id: 'fresh_milk', name: 'Farm Fresh Whole Milk', vietnameseName: 'Sữa Tươi Tiệt Trùng Nguyên Kem', category: 'dairy', unitCost: 0.8, stock: 90, maxStock: 180, qualityGrade: 'standard', spoilageDays: 7, supplierDiscount: 0, autoReorderThreshold: 25, autoReorderAmount: 60 },
  { id: 'syrup_vanilla', name: 'Artisan Vanilla Syrup', vietnameseName: 'Siro Vani Thượng Hạng', category: 'sauce', unitCost: 0.5, stock: 40, maxStock: 100, qualityGrade: 'standard', spoilageDays: 60, supplierDiscount: 0, autoReorderThreshold: 15, autoReorderAmount: 40 },
  { id: 'croissant_dough', name: 'Butter Laminated Pastry', vietnameseName: 'Bột Bánh Sừng Bò Bơ Pháp', category: 'grain', unitCost: 1.1, stock: 50, maxStock: 120, qualityGrade: 'premium', spoilageDays: 5, supplierDiscount: 0, autoReorderThreshold: 15, autoReorderAmount: 45 },
  { id: 'prime_beef', name: 'Black Angus Beef Patty', vietnameseName: 'Thịt Bò Black Angus Thượng Hạng', category: 'meat', unitCost: 2.8, stock: 65, maxStock: 150, qualityGrade: 'premium', spoilageDays: 6, supplierDiscount: 0, autoReorderThreshold: 20, autoReorderAmount: 50 },
  { id: 'brioche_bun', name: 'Brioche Burger Buns', vietnameseName: 'Bánh Mì Brioche Bơ Mềm', category: 'grain', unitCost: 0.6, stock: 80, maxStock: 160, qualityGrade: 'standard', spoilageDays: 5, supplierDiscount: 0, autoReorderThreshold: 25, autoReorderAmount: 60 },
  { id: 'cheddar_cheese', name: 'Aged Cheddar Slices', vietnameseName: 'Phô Mai Cheddar Ủ Lâu Năm', category: 'dairy', unitCost: 0.7, stock: 60, maxStock: 120, qualityGrade: 'standard', spoilageDays: 20, supplierDiscount: 0, autoReorderThreshold: 20, autoReorderAmount: 40 },
  { id: 'fresh_lettuce_tomato', name: 'Crisp Lettuce & Tomatoes', vietnameseName: 'Xà Lách & Cà Chua Tươi Sạch', category: 'produce', unitCost: 0.5, stock: 75, maxStock: 140, qualityGrade: 'organic', spoilageDays: 4, supplierDiscount: 0, autoReorderThreshold: 25, autoReorderAmount: 60 },
  { id: 'chicken_breast', name: 'Tender Chicken Fillet', vietnameseName: 'Ức Gà Phi Lê Tươi Ngon', category: 'meat', unitCost: 1.9, stock: 50, maxStock: 120, qualityGrade: 'standard', spoilageDays: 5, supplierDiscount: 0, autoReorderThreshold: 20, autoReorderAmount: 40 },
  { id: 'matcha_powder', name: 'Ceremonial Grade Matcha', vietnameseName: 'Bột Trà Xanh Matcha Uji Kyoto', category: 'beverage', unitCost: 1.6, stock: 35, maxStock: 80, qualityGrade: 'organic', spoilageDays: 90, supplierDiscount: 0, autoReorderThreshold: 10, autoReorderAmount: 30 },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'espresso_americano',
    name: 'Signature Americano',
    vietnameseName: 'Cà Phê Americano Đậm Đà',
    category: 'coffee',
    baseCost: 1.2,
    sellingPrice: 3.5,
    prepTimeSeconds: 22,
    difficulty: 1,
    quality: 85,
    popularity: 90,
    active: true,
    requiredIngredients: [{ ingredientId: 'coffee_beans', amount: 1 }],
    totalSoldToday: 0,
    totalRevenueToday: 0,
  },
  {
    id: 'caramel_latte',
    name: 'Velvet Vanilla Latte',
    vietnameseName: 'Cà Phê Latte Vani Nhung Mượt',
    category: 'coffee',
    baseCost: 2.5,
    sellingPrice: 5.2,
    prepTimeSeconds: 35,
    difficulty: 2,
    quality: 88,
    popularity: 95,
    active: true,
    requiredIngredients: [
      { ingredientId: 'coffee_beans', amount: 1 },
      { ingredientId: 'fresh_milk', amount: 1 },
      { ingredientId: 'syrup_vanilla', amount: 1 },
    ],
    totalSoldToday: 0,
    totalRevenueToday: 0,
  },
  {
    id: 'matcha_latte',
    name: 'Kyoto Iced Matcha',
    vietnameseName: 'Trà Xanh Matcha Kyoto Đá Xay',
    category: 'tea_beverage',
    baseCost: 2.4,
    sellingPrice: 5.8,
    prepTimeSeconds: 40,
    difficulty: 2,
    quality: 92,
    popularity: 80,
    active: true,
    requiredIngredients: [
      { ingredientId: 'matcha_powder', amount: 1 },
      { ingredientId: 'fresh_milk', amount: 1 },
    ],
    totalSoldToday: 0,
    totalRevenueToday: 0,
  },
  {
    id: 'butter_croissant',
    name: 'Golden Butter Croissant',
    vietnameseName: 'Bánh Sừng Bò Bơ Pháp Vàng Giòn',
    category: 'dessert',
    baseCost: 1.1,
    sellingPrice: 3.8,
    prepTimeSeconds: 15,
    difficulty: 1,
    quality: 84,
    popularity: 75,
    active: true,
    requiredIngredients: [{ ingredientId: 'croissant_dough', amount: 1 }],
    totalSoldToday: 0,
    totalRevenueToday: 0,
  },
  {
    id: 'truffle_burger',
    name: 'Craft Angus Cheeseburger',
    vietnameseName: 'Burger Bò Angus Phô Mai Nướng',
    category: 'main_dish',
    baseCost: 4.6,
    sellingPrice: 11.5,
    prepTimeSeconds: 65,
    difficulty: 3,
    quality: 90,
    popularity: 85,
    active: true,
    requiredIngredients: [
      { ingredientId: 'prime_beef', amount: 1 },
      { ingredientId: 'brioche_bun', amount: 1 },
      { ingredientId: 'cheddar_cheese', amount: 1 },
      { ingredientId: 'fresh_lettuce_tomato', amount: 1 },
    ],
    totalSoldToday: 0,
    totalRevenueToday: 0,
  },
  {
    id: 'crispy_chicken_bowl',
    name: 'Crispy Brioche Chicken',
    vietnameseName: 'Burger Gà Giòn Sốt Brioche',
    category: 'main_dish',
    baseCost: 3.7,
    sellingPrice: 9.8,
    prepTimeSeconds: 55,
    difficulty: 2,
    quality: 82,
    popularity: 78,
    active: true,
    requiredIngredients: [
      { ingredientId: 'chicken_breast', amount: 1 },
      { ingredientId: 'brioche_bun', amount: 1 },
      { ingredientId: 'fresh_lettuce_tomato', amount: 1 },
    ],
    totalSoldToday: 0,
    totalRevenueToday: 0,
  },
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  { id: 'eq_espresso_1', name: 'Dual Boiler Italian Espresso', vietnameseName: 'Máy Pha Cà Phê 2 Cần Ý Nồi Hơi Kép', type: 'espresso_machine', tier: 1, cost: 1200, capacityPerMin: 2.5, reliability: 90, efficiencyBonus: 10, condition: 98 },
  { id: 'eq_grill_1', name: 'Flat Top Commercial Griddle', vietnameseName: 'Bếp Nướng Mặt Phẳng Công Nghiệp', type: 'cooking_range', tier: 1, cost: 1500, capacityPerMin: 1.8, reliability: 88, efficiencyBonus: 10, condition: 95 },
  { id: 'eq_prep_1', name: 'Stainless Prep Table & Chill Well', vietnameseName: 'Bàn Sơ Chế Inox Có Ngăn Làm Mát', type: 'prep_station', tier: 1, cost: 700, capacityPerMin: 3.0, reliability: 95, efficiencyBonus: 5, condition: 100 },
  { id: 'eq_pos_1', name: 'Cloud POS Terminal with QR Ordering', vietnameseName: 'Hệ Thống Thu Ngân POS Đám Mây & Gọi Món QR', type: 'pos_terminal', tier: 1, cost: 500, capacityPerMin: 5.0, reliability: 92, efficiencyBonus: 15, condition: 96 },
];

export const INITIAL_TABLES: DiningTable[] = [
  { id: 'tbl_1', type: 'table_2p', seats: 2, cost: 180, ambianceBonus: 5, x: -3.5, z: 2.0, occupied: false, currentCustomerIds: [] },
  { id: 'tbl_2', type: 'table_2p', seats: 2, cost: 180, ambianceBonus: 5, x: -3.5, z: -1.0, occupied: false, currentCustomerIds: [] },
  { id: 'tbl_3', type: 'table_4p', seats: 4, cost: 320, ambianceBonus: 10, x: 2.5, z: 2.5, occupied: false, currentCustomerIds: [] },
  { id: 'tbl_4', type: 'table_4p', seats: 4, cost: 320, ambianceBonus: 10, x: 2.5, z: -0.5, occupied: false, currentCustomerIds: [] },
  { id: 'tbl_5', type: 'counter_bar', seats: 3, cost: 260, ambianceBonus: 8, x: -0.5, z: -3.5, occupied: false, currentCustomerIds: [] },
];

export const INITIAL_MARKETING: MarketingCampaign[] = [
  { id: 'mkt_ig', name: 'Hyperlocal Instagram Reels', vietnameseName: 'Video Reels & TikTok Giới Thiệu Quán', type: 'social_ads', dailyCost: 25, active: false, trafficBoostPercentage: 20, awarenessBoost: 12, durationDays: 7, daysRemaining: 0 },
  { id: 'mkt_kol', name: 'Foodie Micro-Influencer Review', vietnameseName: 'Food Reviewer Khám Phá Món Ngon', type: 'influencer', dailyCost: 65, active: false, trafficBoostPercentage: 45, awarenessBoost: 25, durationDays: 3, daysRemaining: 0 },
  { id: 'mkt_happy', name: '3PM-5PM Student Happy Hour (20% Off)', vietnameseName: 'Khung Giờ Vàng Sinh Viên Giảm 20% (15h-17h)', type: 'happy_hour_promo', dailyCost: 15, active: false, trafficBoostPercentage: 35, awarenessBoost: 8, durationDays: 14, daysRemaining: 0 },
  { id: 'mkt_billboard', name: 'Transit Station Digital Billboard', vietnameseName: 'Biển Quảng Cáo LED Nhà Ga & Trục Lộ Chính', type: 'local_billboard', dailyCost: 110, active: false, trafficBoostPercentage: 60, awarenessBoost: 40, durationDays: 10, daysRemaining: 0 },
];

export const INITIAL_COMPETITORS: Competitor[] = [
  { id: 'comp_1', name: 'QuickBite Express', vietnameseName: 'Chuỗi Thức Ăn Nhanh QuickBite', brandType: 'fast_food', districtId: 'residential', reputation: 68, priceLevel: 'cheap', marketShare: 32, marketingAggression: 60 },
  { id: 'comp_2', name: 'Artisan Roast & Co.', vietnameseName: 'Cà Phê Rang Xay Thủ Công Artisan', brandType: 'artisan_cafe', districtId: 'business', reputation: 82, priceLevel: 'expensive', marketShare: 28, marketingAggression: 75 },
  { id: 'comp_3', name: 'Urban Crust Bistro', vietnameseName: 'Nhà Hàng Pizza & Mì Ý Urban Crust', brandType: 'bistro_chain', districtId: 'downtown', reputation: 79, priceLevel: 'moderate', marketShare: 40, marketingAggression: 80 },
];

export const INITIAL_DELIVERY_PLATFORMS: { id: string; name: string; commissionPct: number; orderMultiplier: number; active: boolean }[] = [
  { id: 'deliv_fast', name: 'FoodFast Delivery App', commissionPct: 20, orderMultiplier: 1.2, active: true },
  { id: 'deliv_grab', name: 'CityGrab Instant Food', commissionPct: 24, orderMultiplier: 1.5, active: false },
  { id: 'deliv_urban', name: 'UrbanEats Gourmet Express', commissionPct: 18, orderMultiplier: 1.1, active: false },
];

export const INITIAL_COMMISSARY = {
  isUnlocked: false,
  tier: 1,
  dailyPrepCapacity: 120,
  cogsReductionPct: 20,
  dailyOperatingCost: 140,
};

export const INITIAL_BRANCHES = [
  { id: 'branch_hq', districtId: 'residential' as const, name: 'Bistro HQ (Greenwood)', status: 'operational' as const, dailyRevenue: 0, dailyProfit: 0, staffCount: 3 },
  { id: 'branch_tech', districtId: 'business' as const, name: 'Bistro Express (FinTech Hub)', status: 'expanding' as const, dailyRevenue: 0, dailyProfit: 0, staffCount: 0 },
  { id: 'branch_univ', districtId: 'college' as const, name: 'Campus Bistro (Univ Blvd)', status: 'expanding' as const, dailyRevenue: 0, dailyProfit: 0, staffCount: 0 },
];

