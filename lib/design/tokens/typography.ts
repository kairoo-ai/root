export const fontFamily = {
  sans: "var(--font-dm-sans), system-ui, sans-serif",
  display: "var(--font-space-grotesk), var(--font-dm-sans), sans-serif",
  data: "var(--font-mona-sans), var(--font-dm-sans), sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
} as const;

export type TypeStyle = {
  size: string; line: string; weight: number; tracking: string; family: keyof typeof fontFamily;
};

export const typeScale: Record<string, TypeStyle> = {
  display:  { size: "clamp(3rem, 6vw, 4.5rem)",      line: "1.04", weight: 800, tracking: "-0.025em", family: "display" },
  h1:       { size: "clamp(2rem, 3.5vw, 2.75rem)",   line: "1.1",  weight: 800, tracking: "-0.02em",  family: "display" },
  h2:       { size: "2.25rem",                        line: "1.15", weight: 700, tracking: "-0.015em", family: "display" },
  h3:       { size: "1.75rem",                        line: "1.2",  weight: 700, tracking: "-0.01em",  family: "sans" },
  h4:       { size: "1.375rem",                       line: "1.3",  weight: 700, tracking: "0",        family: "sans" },
  h5:       { size: "1.125rem",                       line: "1.4",  weight: 600, tracking: "0",        family: "sans" },
  "body-lg":{ size: "1.125rem",                       line: "1.7",  weight: 400, tracking: "0",        family: "sans" },
  body:     { size: "1rem",                           line: "1.6",  weight: 400, tracking: "0",        family: "sans" },
  "body-sm":{ size: "0.875rem",                       line: "1.55", weight: 400, tracking: "0",        family: "sans" },
  caption:  { size: "0.75rem",                        line: "1.4",  weight: 500, tracking: "0",        family: "sans" },
  overline: { size: "0.75rem",                        line: "1.2",  weight: 700, tracking: "0.08em",   family: "sans" },
  code:     { size: "0.875rem",                       line: "1.5",  weight: 400, tracking: "0",        family: "mono" },
  data:     { size: "1rem",                           line: "1.4",  weight: 500, tracking: "0",        family: "data" },
};

export const typography = { fontFamily, typeScale };
