export const CARD_BACK_IMAGE = "/images/card-back.png";

export const HOLD_DURATION_MS = 1000;
export const DRAG_THRESHOLD_PX = 8;
export const DRAG_SENSITIVITY = 0.35;
export const INERTIA_FRICTION = 0.94;
export const INERTIA_MIN_VELOCITY = 0.15;
export const RING_RADIUS = 420;
export const RING_TILT_X = 0;
export const CARD_WIDTH = 64;
export const CARD_HEIGHT = 96;
export const FOCUSED_SCALE = 1.16;
export const BASE_CARD_SCALE = 0.88;

export function normalizeAngle(angle: number): number {
  let a = ((angle % 360) + 360) % 360;
  if (a > 180) a -= 360;
  return a;
}

export function getFocusedIndex(rotation: number, count: number): number {
  if (count <= 0) return 0;
  const step = 360 / count;
  let bestIndex = 0;
  let bestDist = Infinity;

  for (let i = 0; i < count; i++) {
    const dist = Math.abs(normalizeAngle(rotation + i * step));
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export function snapRotation(rotation: number, count: number): number {
  if (count <= 0) return rotation;
  const step = 360 / count;
  return Math.round(rotation / step) * step;
}

export function getCardVisuals(
  index: number,
  rotation: number,
  count: number,
  focusedIndex: number,
) {
  const step = 360 / count;
  const angle = normalizeAngle(rotation + index * step);
  const absAngle = Math.abs(angle);
  const isFocused = index === focusedIndex;

  const scale = isFocused
    ? FOCUSED_SCALE
    : Math.max(0.58, BASE_CARD_SCALE - absAngle / 180);
  const opacity = isFocused
    ? 1
    : Math.max(0.1, 1 - absAngle / 95);
  const zIndex = Math.round(100 - absAngle);

  return { angle, absAngle, scale, opacity, zIndex, isFocused };
}
