// Deterministic "randomness" so the same seed always produces the same
// rating/review-count/etc. Keeps the mock catalog consistent across renders.
export function seededFloat(seed, min = 0, max = 1) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (Math.abs(hash) % 1000) / 1000;
  return min + normalized * (max - min);
}

export function seededInt(seed, min, max) {
  return Math.floor(seededFloat(seed, min, max + 1));
}

export function pick(seed, arr) {
  return arr[seededInt(seed, 0, arr.length - 1)];
}

export function img(seed, w = 900, h = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
