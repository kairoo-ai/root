// Kairoo color primitives - OKLCH ramps. Source of truth (do not hardcode colors elsewhere).
// Values are oklch() strings consumed verbatim by CSS (Tailwind v4) and JS (Chart.js/Motion).

export type Ramp = Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950",
  string
>;

const ramp = (
  l: number[], c: number[], h: number,
): Ramp => {
  const steps = ["50","100","200","300","400","500","600","700","800","900","950"] as const;
  const out = {} as Ramp;
  steps.forEach((s, i) => { out[s] = `oklch(${l[i]} ${c[i]} ${h})`; });
  return out;
};

export const teal = ramp(
  [0.97,0.94,0.88,0.80,0.74,0.66,0.58,0.50,0.42,0.35,0.27],
  [0.02,0.04,0.06,0.09,0.11,0.115,0.10,0.085,0.07,0.055,0.04], 185);

export const navy = ramp(
  [0.97,0.93,0.86,0.76,0.64,0.52,0.42,0.34,0.28,0.23,0.18],
  [0.01,0.02,0.035,0.05,0.065,0.07,0.07,0.06,0.05,0.04,0.035], 255);

export const amber = ramp(
  [0.97,0.94,0.90,0.85,0.81,0.77,0.68,0.57,0.47,0.40,0.30],
  [0.03,0.06,0.10,0.13,0.155,0.16,0.15,0.13,0.10,0.08,0.06], 72);

export const gold = ramp(
  [0.97,0.94,0.89,0.84,0.79,0.74,0.66,0.56,0.46,0.38,0.29],
  [0.02,0.04,0.06,0.08,0.09,0.10,0.095,0.08,0.065,0.05,0.04], 90);

export const neutral = ramp(
  [0.985,0.967,0.922,0.87,0.708,0.556,0.46,0.37,0.27,0.205,0.145],
  [0.002,0.004,0.006,0.008,0.012,0.014,0.014,0.012,0.01,0.008,0.006], 255);

export const success = ramp(
  [0.97,0.94,0.88,0.80,0.72,0.65,0.56,0.47,0.39,0.33,0.26],
  [0.03,0.06,0.10,0.14,0.16,0.17,0.15,0.12,0.10,0.08,0.06], 150);

export const warning = ramp(
  [0.97,0.94,0.89,0.83,0.78,0.72,0.62,0.52,0.43,0.36,0.28],
  [0.03,0.06,0.10,0.13,0.15,0.16,0.15,0.13,0.10,0.08,0.06], 55);

export const error = ramp(
  [0.97,0.94,0.89,0.82,0.74,0.64,0.55,0.47,0.40,0.34,0.27],
  [0.02,0.05,0.09,0.13,0.17,0.20,0.19,0.16,0.13,0.10,0.08], 27);

export const info = ramp(
  [0.97,0.94,0.88,0.80,0.70,0.60,0.52,0.45,0.38,0.32,0.25],
  [0.02,0.05,0.09,0.13,0.16,0.18,0.17,0.15,0.12,0.10,0.08], 260);

export const ramps = { teal, navy, amber, gold, neutral, success, warning, error, info } as const;
export type RampName = keyof typeof ramps;

export type SemanticMap = Record<string, { light: string; dark: string }>;

export const semantic: SemanticMap = {
  background:            { light: "neutral.50",  dark: "navy.950" },
  foreground:            { light: "navy.900",    dark: "neutral.50" },
  card:                  { light: "neutral.50",  dark: "navy.900" },
  "card-foreground":     { light: "navy.900",    dark: "neutral.50" },
  popover:               { light: "neutral.50",  dark: "navy.900" },
  "popover-foreground":  { light: "navy.900",    dark: "neutral.50" },
  primary:               { light: "teal.600",    dark: "teal.400" },
  "primary-foreground":  { light: "neutral.50",  dark: "navy.950" },
  secondary:             { light: "neutral.100", dark: "navy.800" },
  "secondary-foreground":{ light: "navy.800",    dark: "neutral.100" },
  // muted = muted TEXT (HeroUI v3 reads --muted as muted text; Kairoo text uses --muted-foreground)
  muted:                 { light: "neutral.500", dark: "neutral.400" },
  "muted-foreground":    { light: "neutral.500", dark: "neutral.400" },
  // muted SURFACE (the old --muted value), preserved additively for Kairoo surfaces
  "muted-surface":       { light: "neutral.100", dark: "navy.800" },
  // accent = BRAND (HeroUI v3 reads --accent as brand); mirrors primary
  accent:                { light: "teal.600",    dark: "teal.400" },
  "accent-foreground":   { light: "neutral.50",  dark: "navy.950" },
  // the old pale accent tint, preserved additively
  "accent-subtle":            { light: "teal.50",  dark: "navy.800" },
  "accent-subtle-foreground": { light: "teal.700", dark: "teal.300" },
  destructive:           { light: "error.600",   dark: "error.500" },
  "destructive-foreground": { light: "neutral.50", dark: "navy.950" },
  success:               { light: "success.600", dark: "success.500" },
  warning:               { light: "warning.600", dark: "warning.500" },
  info:                  { light: "info.600",    dark: "info.500" },
  border:                { light: "neutral.200", dark: "navy.800" },
  input:                 { light: "neutral.200", dark: "navy.800" },
  ring:                  { light: "teal.500",    dark: "teal.400" },
  "tier-free":           { light: "amber.500",   dark: "amber.400" },
  "tier-pro":            { light: "teal.600",     dark: "teal.400" },
  "tier-enterprise":     { light: "navy.900",     dark: "navy.300" },
  "tier-enterprise-accent": { light: "gold.500",  dark: "gold.400" },
};

export const colors = { ramps, semantic };
