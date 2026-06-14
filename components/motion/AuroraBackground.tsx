"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface AuroraBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual strength of the aurora blobs.
   * - "subtle": faint, ambient wash
   * - "default": balanced premium glow
   * - "vivid": maximal showcase
   */
  intensity?: "subtle" | "default" | "vivid";
}

/**
 * AuroraBackground
 *
 * A fixed, pointer-events-none, behind-everything layer of large blurred
 * radial-gradient "aurora" blobs. Colors are derived entirely from design
 * tokens via `color-mix(in oklab, ...)` — no raw hex/rgb/hsl.
 *
 * Blobs slowly drift + scale with CSS @keyframes (scoped via a <style> tag).
 * Under `prefers-reduced-motion: reduce` the animations are disabled and the
 * layer renders as a calm static gradient field.
 *
 * The keyframes are namespaced (`astra-aurora-*`) and injected locally so this
 * component is self-contained and does not require edits to globals.css.
 */
function AuroraBackground({
  className,
  intensity = "subtle",
  style,
  ...props
}: AuroraBackgroundProps) {
  // Per-intensity tuning: blob opacity, blur radius, and gradient mix strength.
  // Deliberately faint — this is an AMBIENT depth layer, not a colored show.
  // Brand stays clean deep-navy with only a hint of teal.
  const tuning = {
    subtle: { opacity: 0.1, blur: 55, primaryMix: 6, accentMix: 6 },
    default: { opacity: 0.16, blur: 60, primaryMix: 9, accentMix: 9 },
    vivid: { opacity: 0.28, blur: 70, primaryMix: 14, accentMix: 14 },
  }[intensity];

  // Each blob is a single large radial gradient sized/positioned via inline
  // style. color-mix keeps everything token-driven and theme-reactive.
  const blob = (
    base: string,
    mix: number,
    position: string,
    size: string,
  ): React.CSSProperties => ({
    background: `radial-gradient(closest-side, color-mix(in oklab, var(${base}) ${mix}%, transparent) 0%, color-mix(in oklab, var(${base}) ${Math.round(
      mix * 0.45,
    )}%, transparent) 45%, transparent 75%)`,
    position: "absolute",
    inset: "auto",
    width: size,
    height: size,
    ...parsePosition(position),
  });

  return (
    <div
      aria-hidden="true"
      data-slot="aurora-background"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        // Subtle base wash so dark/light both have depth even before blobs.
        "[background:radial-gradient(120%_120%_at_50%_-10%,color-mix(in_oklab,var(--primary)_6%,transparent),transparent_60%)]",
        className,
      )}
      style={{ filter: `blur(${tuning.blur}px)`, ...style }}
      {...props}
    >
      <div
        className="astra-aurora-blob astra-aurora-blob--a absolute"
        style={{
          ...blob("--primary", tuning.primaryMix, "-12% -18%", "65vmax"),
          opacity: tuning.opacity,
        }}
      />
      <div
        className="astra-aurora-blob astra-aurora-blob--b absolute"
        style={{
          ...blob("--accent", tuning.accentMix, "70% -10%", "60vmax"),
          opacity: tuning.opacity,
        }}
      />
      <div
        className="astra-aurora-blob astra-aurora-blob--c absolute"
        style={{
          ...blob(
            "--primary",
            Math.round(tuning.primaryMix * 0.8),
            "55% 65%",
            "70vmax",
          ),
          opacity: tuning.opacity * 0.9,
        }}
      />
      <div
        className="astra-aurora-blob astra-aurora-blob--d absolute"
        style={{
          ...blob(
            "--accent",
            Math.round(tuning.accentMix * 0.7),
            "-15% 60%",
            "55vmax",
          ),
          opacity: tuning.opacity * 0.85,
        }}
      />

      <style>{auroraKeyframes}</style>
    </div>
  );
}

/** Convert a "x y" position string into top/left or right/bottom anchors. */
function parsePosition(pos: string): React.CSSProperties {
  const [x, y] = pos.split(/\s+/);
  return { left: x, top: y };
}

const auroraKeyframes = `
@keyframes astra-aurora-a {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  50%  { transform: translate3d(8%, 6%, 0) scale(1.15); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes astra-aurora-b {
  0%   { transform: translate3d(0, 0, 0) scale(1.05); }
  50%  { transform: translate3d(-10%, 8%, 0) scale(0.92); }
  100% { transform: translate3d(0, 0, 0) scale(1.05); }
}
@keyframes astra-aurora-c {
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  50%  { transform: translate3d(-6%, -8%, 0) scale(1.18); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes astra-aurora-d {
  0%   { transform: translate3d(0, 0, 0) scale(0.95); }
  50%  { transform: translate3d(10%, -6%, 0) scale(1.1); }
  100% { transform: translate3d(0, 0, 0) scale(0.95); }
}
.astra-aurora-blob { will-change: transform; transform-origin: center; }
.astra-aurora-blob--a { animation: astra-aurora-a 26s ease-in-out infinite; }
.astra-aurora-blob--b { animation: astra-aurora-b 32s ease-in-out infinite; }
.astra-aurora-blob--c { animation: astra-aurora-c 38s ease-in-out infinite; }
.astra-aurora-blob--d { animation: astra-aurora-d 30s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .astra-aurora-blob { animation: none !important; }
}
`;

export default AuroraBackground;
