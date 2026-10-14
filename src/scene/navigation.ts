export interface Point2D {
  x: number;
  z: number;
}

/**
 * Waypoint network and path generation to avoid clipping through bar counter,
 * tables, and walls in BistroTycoon.
 */

// Key unobstructed navigation nodes
export const NAV_NODES = {
  STREET_SPAWN: { x: 0, z: 9.0 },
  STREET_EXIT: { x: 0, z: 12.0 },
  DOORWAY_OUTSIDE: { x: 0, z: 5.5 },
  DOORWAY_INSIDE: { x: 0, z: 4.6 },
  CENTRAL_FOYER: { x: 0, z: 3.8 },
  QUEUE_ENTRY: { x: -1.2, z: 3.8 },
  LEFT_AISLE_FRONT: { x: -1.8, z: 3.6 },
  LEFT_AISLE_MID: { x: -1.8, z: 1.8 },
  LEFT_AISLE_BACK: { x: -1.8, z: -0.2 },
  RIGHT_AISLE_FRONT: { x: 0.8, z: 3.6 },
  RIGHT_AISLE_MID: { x: 0.8, z: 1.8 },
  RIGHT_AISLE_BACK: { x: 0.8, z: -0.2 },
  STAFF_PASSAGE_RIGHT: { x: 2.9, z: 1.8 },
  STAFF_PASSAGE_BEHIND: { x: 2.9, z: -0.4 },
};

/**
 * Checks if a direct line segment between (x1, z1) and (x2, z2) crosses
 * the solid bar counter bounding box.
 */
export function intersectsCounter(x1: number, z1: number, x2: number, z2: number): boolean {
  // Bar counter bounding box with safety margin
  const minX = -2.8;
  const maxX = 2.8;
  const minZ = -0.3;
  const maxZ = 1.35;

  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = x1 + (x2 - x1) * t;
    const pz = z1 + (z2 - z1) * t;
    if (px >= minX && px <= maxX && pz >= minZ && pz <= maxZ) {
      return true;
    }
  }
  return false;
}

/**
 * Generates an unobstructed waypoint route from current position to target.
 */
export function generateWaypointPath(
  fromX: number,
  fromZ: number,
  toX: number,
  toZ: number,
  isLeaving = false
): Point2D[] {
  const path: Point2D[] = [];

  // Case 1: Exiting towards the street
  if (isLeaving || toZ >= 6.0) {
    if (fromZ < 4.0) {
      // Return to unobstructed central aisle first
      const aisleX = fromX < -0.5 ? -1.5 : fromX > 0.5 ? 0.8 : 0;
      path.push({ x: aisleX, z: 3.8 });
      path.push(NAV_NODES.CENTRAL_FOYER);
    }
    path.push(NAV_NODES.DOORWAY_INSIDE);
    path.push(NAV_NODES.DOORWAY_OUTSIDE);
    path.push({ x: toX, z: toZ });
    return path;
  }

  // Case 2: Entering from street into restaurant
  if (fromZ > 4.8) {
    path.push(NAV_NODES.DOORWAY_OUTSIDE);
    path.push(NAV_NODES.DOORWAY_INSIDE);
    path.push(NAV_NODES.CENTRAL_FOYER);

    // If destination is in left dining area or queue
    if (toX < -0.8) {
      path.push(NAV_NODES.QUEUE_ENTRY);
      if (toZ < 2.5) {
        path.push(NAV_NODES.LEFT_AISLE_MID);
      }
    } else if (toX > 0.6) {
      // Right dining area
      path.push(NAV_NODES.RIGHT_AISLE_FRONT);
      if (toZ < 1.0) {
        path.push(NAV_NODES.RIGHT_AISLE_MID);
      }
    }
    path.push({ x: toX, z: toZ });
    return path;
  }

  // Case 3: Moving inside restaurant, check if direct path crosses the counter
  if (intersectsCounter(fromX, fromZ, toX, toZ)) {
    // Route around through front corridor
    const safeZ = 2.2;
    path.push({ x: fromX, z: safeZ });
    path.push({ x: toX, z: safeZ });
  }

  path.push({ x: toX, z: toZ });
  return path;
}
