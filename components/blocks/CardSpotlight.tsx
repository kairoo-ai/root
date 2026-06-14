"use client";

import {
  useMotionValue,
  motion,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity Card Spotlight — a bordered surface that reveals a soft accent glow
 * tracking the cursor. Fully token-skinned: surface uses `bg-card`/`border-border`,
 * and the spotlight glow is composed from the brand accent + primary tokens via
 * `color-mix`. The original WebGL `canvas-reveal-effect` dependency was removed in
 * favor of a lightweight, token-clean radial wash.
 *
 * Respects `prefers-reduced-motion`: when reduced motion is requested the glow is
 * not tracked/animated and the card renders as a static token surface.
 */
export const CardSpotlight = ({
  children,
  radius = 350,
  className,
  ...props
}: {
  radius?: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const prefersReduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, color-mix(in oklab, var(--accent) 30%, transparent), transparent 80%)`;

  return (
    <div
      className={cn(
        "group/spotlight relative rounded-md border border-border bg-card p-10",
        className,
      )}
      onMouseMove={prefersReduced ? undefined : handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {!prefersReduced && isHovering && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px z-0 rounded-md opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
          style={{ background }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CardSpotlight;
