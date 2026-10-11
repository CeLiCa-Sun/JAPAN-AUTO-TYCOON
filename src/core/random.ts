/** Deterministic xorshift32. State is a nonzero unsigned 32-bit integer. */
export function nextRandom(seed: number): { seed: number; value: number } {
  let x = (seed >>> 0) || 0x6d2b79f5;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  const next = x >>> 0;
  return { seed: next, value: next / 4294967296 };
}
