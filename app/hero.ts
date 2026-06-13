import { heroui } from "@heroui/react";

// Hex anchors mirroring lib/design/tokens (HeroUI needs hex, not oklch).
const TEAL_600 = "#0D9488";
const TEAL_400 = "#2DD4BF";
const TEAL_500 = "#14B8A6";
const NAVY_900 = "#0B1F3A";
const NAVY_950 = "#071426";
const MIST = "#F8FAFC";

export default heroui({
  themes: {
    light: {
      colors: {
        background: MIST,
        foreground: NAVY_900,
        primary: { DEFAULT: TEAL_600, foreground: MIST },
        focus: TEAL_500,
      },
    },
    dark: {
      colors: {
        background: NAVY_950,
        foreground: MIST,
        primary: { DEFAULT: TEAL_400, foreground: NAVY_950 },
        focus: TEAL_400,
      },
    },
  },
});
