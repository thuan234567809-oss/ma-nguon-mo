export interface QueueTransform {
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

/**
 * Calculates personal queue slot along the spacious central aisle in front of POS.
 * Spacing of 0.75m prevents overlapping between customers and prevents collision with tables.
 */
export function getQueuePosition(queueIndex: number): QueueTransform {
  const safeIndex = Math.max(0, queueIndex);
  const posFrontX = -1.2;
  const posFrontZ = 1.85; // 0.7m away from marble counter edge
  const slotSpacing = 0.75;

  if (safeIndex < 4) {
    // Clean straight vertical queue line in open corridor
    return {
      x: posFrontX,
      y: 0.1,
      z: posFrontZ + safeIndex * slotSpacing,
      rotationY: Math.PI, // Facing the counter register (towards -Z)
    };
  }

  // If long queue (> 4 customers), curve gently towards the front entrance corridor
  const overflowIndex = safeIndex - 3;
  const curvedX = posFrontX + Math.min(1.2, overflowIndex * 0.35);
  const curvedZ = posFrontZ + 3 * slotSpacing + overflowIndex * 0.65;

  return {
    x: curvedX,
    y: 0.1,
    z: Math.min(5.5, curvedZ),
    rotationY: Math.PI * 0.9,
  };
}
