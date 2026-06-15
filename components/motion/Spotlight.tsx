"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  /**
   * Fill color for the spotlight ellipse. Defaults to the brand accent token.
   * Pass any CSS color string (ideally a token, e.g. `var(--primary)`).
   */
  fill?: string;
};

/**
 * Aceternity Spotlight - a large, blurred, off-screen ellipse that animates into
 * view to spotlight hero content. Fully token-skinned: the default fill resolves
 * to `var(--accent)` and the entrance animation is driven by the token-based
 * `.animate-spotlight` keyframes in globals.css.
 *
 * Respects `prefers-reduced-motion` (animation is neutralized globally) and works
 * in both light and dark themes since it relies on opacity-blended accent color.
 */
export const Spotlight = ({ className, fill }: SpotlightProps) => {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-1 h-[169%] w-[138%] opacity-0 lg:w-[84%]",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      aria-hidden
    >
      <g filter="url(#spotlight-filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "var(--accent)"}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="spotlight-filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Spotlight;
