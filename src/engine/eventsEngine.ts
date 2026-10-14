import { GameEvent, GameState } from '../types/game';

export const POSSIBLE_EVENTS: Omit<GameEvent, 'active' | 'durationHours'>[] = [
  {
    id: 'food_critic_visit',
    title: 'Michelin / Viral Critic Inspection',
    description: 'A well-known gourmet food reviewer is dining incognito in our district! Excellent quality and fast service will skyrocket reputation.',
    type: 'opportunity',
    impact: {
      trafficMultiplier: 1.35,
      reputationChange: 8,
    },
  },
  {
    id: 'heatwave_surge',
    title: 'Scorching Summer Heatwave (38°C)',
    description: 'Pedestrians are craving ice-cold iced americanos, fruity matcha, and air-conditioned seating. Beverage demand doubled!',
    type: 'opportunity',
    impact: {
      trafficMultiplier: 1.4,
      revenueMultiplier: 1.25,
    },
  },
  {
    id: 'supply_chain_crunch',
    title: 'National Coffee Bean Logistics Delay',
    description: 'Wholesale port congestion has caused raw coffee bean prices to surge by 30% for the next 24 hours.',
    type: 'crisis',
    impact: {
      ingredientCostMultiplier: 1.3,
    },
  },
  {
    id: 'tech_expo_nearby',
    title: 'International Tech Expo at Convention Center',
    description: 'Over 10,000 visitors, executives, and exhibitors are swarming nearby streets looking for quick lunch and espresso.',
    type: 'opportunity',
    impact: {
      trafficMultiplier: 1.8,
      revenueMultiplier: 1.3,
    },
  },
  {
    id: 'sudden_monsoon',
    title: 'Flash Torrential Downpour & Road Flood',
    description: 'Pedestrian foot traffic dropped abruptly by 40%, but takeout & delivery apps are experiencing explosive order queues!',
    type: 'market_shift',
    impact: {
      trafficMultiplier: 0.7,
      staffStressMultiplier: 1.2,
    },
  },
  {
    id: 'local_festival',
    title: 'Street Food & Music Carnival',
    description: 'A vibrant weekend street festival has opened on the promenade, flooding our storefront with hungry youth & families.',
    type: 'opportunity',
    impact: {
      trafficMultiplier: 1.6,
      reputationChange: 5,
    },
  },
  {
    id: 'corporate_hq_movein',
    title: 'Tech Unicorn Opens Office Campus Nearby',
    description: 'A 2,000-employee AI company moved in next door! Huge surge in morning artisan espresso & premium lunchtime cheeseburgers.',
    type: 'opportunity',
    impact: {
      trafficMultiplier: 1.7,
      revenueMultiplier: 1.35,
    },
  },
  {
    id: 'metro_station_opened',
    title: 'New Metro Transit Hub Station Opens',
    description: 'The city has completed the transit line directly in front of the district! Pedestrian foot traffic permanently energized.',
    type: 'opportunity',
    impact: {
      trafficMultiplier: 1.4,
      reputationChange: 4,
    },
  },
  {
    id: 'roadwork_detour',
    title: 'Water Main Pipe Repair & Sidewalk Barrier',
    description: 'City municipal works have cordoned off our street lane for 8 hours. Walk-in traffic drops, but delivery scooters navigate freely!',
    type: 'market_shift',
    impact: {
      trafficMultiplier: 0.65,
      staffStressMultiplier: 1.15,
    },
  },
  {
    id: 'tiktok_viral_dish',
    title: 'Foodie Viral Video Hits 2 Million Views!',
    description: 'A viral video praising our signature recipes is trending! Customers from across the metropolis are queuing around the block.',
    type: 'opportunity',
    impact: {
      trafficMultiplier: 2.1,
      revenueMultiplier: 1.45,
      reputationChange: 10,
    },
  },
];

export function checkAndTriggerRandomEvents(state: GameState): GameEvent | null {
  // If an event is already active, don't overwhelm the player
  if (state.activeEvents.length > 0) return null;

  // 4% chance per hour check
  if (Math.random() < 0.04) {
    const randomIndex = Math.floor(Math.random() * POSSIBLE_EVENTS.length);
    const template = POSSIBLE_EVENTS[randomIndex];
    const newEvent: GameEvent = {
      ...template,
      active: true,
      durationHours: Math.floor(Math.random() * 8) + 6, // 6 to 14 in-game hours
    };
    return newEvent;
  }

  return null;
}
