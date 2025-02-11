// src/utils/helpers.js
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const lerp = (start, end, alpha) => start * (1 - alpha) + end * alpha;