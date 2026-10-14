import { DiningTable } from '../types/game';

export interface SeatTransform {
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

/**
 * Calculates the exact chair position and orientation facing the table center.
 * This prevents customers from standing in the center of the table or clipping through wood.
 */
export function getTableSeatTransform(table: DiningTable, seatIndex: number): SeatTransform {
  const isRound = table.type === 'table_2p';
  const chairOffset = isRound ? 0.82 : 0.95;
  const safeSeatIndex = Math.max(0, seatIndex % Math.max(1, table.seats));

  let seatX: number;
  let seatZ: number;

  if (table.type === 'counter_bar') {
    // Stools arranged along bar side
    const spacing = 0.8;
    const startX = -((table.seats - 1) * spacing) / 2;
    seatX = table.x + startX + safeSeatIndex * spacing;
    seatZ = table.z + 0.8; // positioned in front of counter bar
    return {
      x: seatX,
      y: 0.18, // slightly higher stool seat
      z: seatZ,
      rotationY: Math.PI, // Facing towards negative Z (the counter)
    };
  }

  // Round 2P and Rectangular 4P tables
  const angle = (safeSeatIndex / table.seats) * Math.PI * 2;
  seatX = table.x + Math.cos(angle) * chairOffset;
  seatZ = table.z + Math.sin(angle) * chairOffset;

  // Face the center of the dining table
  const dx = table.x - seatX;
  const dz = table.z - seatZ;
  const rotationY = Math.atan2(dx, dz);

  return {
    x: seatX,
    y: 0.12, // Lowered seated body height to rest on cushion
    z: seatZ,
    rotationY,
  };
}

/**
 * Finds the first unoccupied seat index for a table
 */
export function findAvailableSeatIndex(
  table: DiningTable,
  occupiedSeatIndices: number[]
): number {
  for (let i = 0; i < table.seats; i++) {
    if (!occupiedSeatIndices.includes(i)) {
      return i;
    }
  }
  return 0;
}
