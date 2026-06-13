export const shadow: Record<string, string> = {
  "0": "none",
  "1": "0 1px 2px 0 oklch(0.23 0.04 255 / 0.08)",
  "2": "0 2px 8px -1px oklch(0.23 0.04 255 / 0.10)",
  "3": "0 8px 20px -4px oklch(0.23 0.04 255 / 0.12)",
  "4": "0 16px 40px -8px oklch(0.23 0.04 255 / 0.16)",
  "5": "0 30px 80px -12px oklch(0.23 0.04 255 / 0.22)",
};
export const blur = { glass: "18px" } as const;
export const shadows = { shadow, blur };
