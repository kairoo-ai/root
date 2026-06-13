export const space: Record<string, string> = {
  "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem",
  "5": "1.25rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem", "12": "3rem",
  "16": "4rem", "20": "5rem", "24": "6rem", "32": "8rem",
};
export const layout = {
  gutter: "1.5rem",
  "section-y": "clamp(3rem, 8vw, 6rem)",
  stack: "1rem",
  "content-max": "75rem",
} as const;
export const spacing = { space, layout };
