export const duration = { fast: "120ms", base: "200ms", slow: "320ms", slower: "500ms" } as const;
export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.3, 0, 0, 1)",
  decelerate: "cubic-bezier(0, 0, 0, 1)",
  accelerate: "cubic-bezier(0.3, 0, 1, 1)",
} as const;
export const motion = { duration, easing };
