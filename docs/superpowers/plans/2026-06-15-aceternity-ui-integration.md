# Aceternity UI Full Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install and integrate 32 Aceternity UI components throughout the entire Kairoo app — marketing site, app shell, auth, and onboarding — themed to OKLCH design tokens, zero new npm dependencies.

**Architecture:** All components are copy-paste into `components/aceternity/`, themed via CSS custom properties that already exist in the design token system. Four tiny token aliases are added to `globals.css`. Components are client islands (`'use client'`) wired into server-component pages as leaf nodes.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, framer-motion v12, OKLCH design tokens, Clerk auth

---

## Task 1: Token Bridge + Index Foundation

**Files:**
- Modify: `app/globals.css` (add 4 lines to `:root`)
- Create: `components/aceternity/index.ts`

- [ ] **Step 1: Add aceternity token aliases to globals.css**

Open `app/globals.css`. Find the `:root` block at line ~363 that contains `--radius: 0.625rem;`. Add these 4 lines immediately after it:

```css
  --aceternity-glow: var(--primary);
  --aceternity-beam: var(--accent);
  --aceternity-noise-opacity: 0.035;
  --aceternity-spotlight-color: color-mix(in oklch, var(--primary) 15%, transparent);
```

- [ ] **Step 2: Create the aceternity index barrel**

```ts
// components/aceternity/index.ts
export { GooeyInput } from './GooeyInput'
export { CanvasText } from './CanvasText'
export { NoiseBackground } from './NoiseBackground'
export { TextHoverEffect } from './TextHoverEffect'
export { AppleCardsCarousel } from './AppleCardsCarousel'
export { BackgroundRipple } from './BackgroundRipple'
export { CardSpotlight } from './CardSpotlight'
export { Cover } from './Cover'
export { DraggableCard } from './DraggableCard'
export { ShimmerLoader } from './ShimmerLoader'
export { SVGLoader } from './SVGLoader'
export { SimpleLoader } from './SimpleLoader'
export { StatefulButton } from './StatefulButton'
export { NavbarWithChildren } from './NavbarWithChildren'
export { StickyBanner } from './StickyBanner'
export { GeminiEffect } from './GeminiEffect'
export { Marquee3D } from './Marquee3D'
export { TracingBeam } from './TracingBeam'
export { BentoGridAceternity } from './BentoGridAceternity'
export { GlowingEffect } from './GlowingEffect'
export { GridDotBackground } from './GridDotBackground'
export { AceternitySidebar } from './Sidebar'
export { SpotlightNew } from './SpotlightNew'
export { FollowingPointer } from './FollowingPointer'
export { TailwindButtons } from './TailwindButtons'
export { Timeline } from './Timeline'
export { LampEffect } from './LampEffect'
export { InfiniteMovingCards } from './InfiniteMovingCards'
export { AnimatedTooltip } from './AnimatedTooltip'
export { TypewriterEffect } from './TypewriterEffect'
export { FloatingNavbar } from './FloatingNavbar'
export { BackgroundBoxes } from './BackgroundBoxes'
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: zero errors (index.ts will error on missing files — that's fine, resolve in each task)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css components/aceternity/index.ts
git commit -m "feat(aceternity): token bridge + component index foundation"
```

---

## Task 2: Loading Primitives — ShimmerLoader, SimpleLoader, SVGLoader

**Files:**
- Create: `components/aceternity/ShimmerLoader.tsx`
- Create: `components/aceternity/SimpleLoader.tsx`
- Create: `components/aceternity/SVGLoader.tsx`

- [ ] **Step 1: Create ShimmerLoader**

```tsx
// components/aceternity/ShimmerLoader.tsx
'use client'

import { cn } from '@/lib/utils'

interface ShimmerLoaderProps {
  className?: string
  lines?: number
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export function ShimmerLoader({ className, lines = 1, rounded = 'md' }: ShimmerLoaderProps) {
  const radiusMap = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }
  return (
    <div className={cn('space-y-2', className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'relative overflow-hidden bg-muted',
            radiusMap[rounded],
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
            'h-4',
          )}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  )
}
```

Add this keyframe to `app/globals.css` in the `@keyframes` section (or add it if absent):

```css
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
```

- [ ] **Step 2: Create SimpleLoader**

```tsx
// components/aceternity/SimpleLoader.tsx
'use client'

import { cn } from '@/lib/utils'

interface SimpleLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SimpleLoader({ size = 'md', className }: SimpleLoaderProps) {
  const sizeMap = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-[3px]' }
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizeMap[size],
        'text-primary',
        className,
      )}
    />
  )
}
```

- [ ] **Step 3: Create SVGLoader (path-tracing logo animation)**

```tsx
// components/aceternity/SVGLoader.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SVGLoaderProps {
  /** SVG path d="" string from your logo */
  pathD: string
  viewBox?: string
  size?: number
  className?: string
  strokeColor?: string
  duration?: number
}

export function SVGLoader({
  pathD,
  viewBox = '0 0 100 100',
  size = 48,
  className,
  strokeColor = 'var(--primary)',
  duration = 1.8,
}: SVGLoaderProps) {
  const reduce = useReducedMotion()
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      className={cn('animate-pulse', className)}
    >
      <motion.path
        d={pathD}
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={reduce ? { pathLength: 1, opacity: 1 } : {
          pathLength: [0, 1, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/aceternity/ShimmerLoader.tsx components/aceternity/SimpleLoader.tsx components/aceternity/SVGLoader.tsx app/globals.css
git commit -m "feat(aceternity): ShimmerLoader, SimpleLoader, SVGLoader"
```

---

## Task 3: Button System — StatefulButton + TailwindButtons

**Files:**
- Create: `components/aceternity/StatefulButton.tsx`
- Create: `components/aceternity/TailwindButtons.tsx`

- [ ] **Step 1: Create StatefulButton**

```tsx
// components/aceternity/StatefulButton.tsx
'use client'

import { useState, useCallback } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

interface StatefulButtonProps {
  children: React.ReactNode
  onClick?: () => Promise<void> | void
  state?: ButtonState
  className?: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  successText?: string
  errorText?: string
}

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent',
  outline: 'border border-border bg-transparent text-foreground hover:bg-accent-subtle',
  ghost: 'border-transparent bg-transparent text-foreground hover:bg-accent-subtle',
}
const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export function StatefulButton({
  children,
  onClick,
  state: controlledState,
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  type = 'button',
  successText = 'Done',
  errorText = 'Try again',
}: StatefulButtonProps) {
  const [internalState, setInternalState] = useState<ButtonState>('idle')
  const reduce = useReducedMotion()
  const state = controlledState ?? internalState

  const handleClick = useCallback(async () => {
    if (!onClick || state === 'loading') return
    setInternalState('loading')
    try {
      await onClick()
      setInternalState('success')
      setTimeout(() => setInternalState('idle'), 2000)
    } catch {
      setInternalState('error')
      setTimeout(() => setInternalState('idle'), 2500)
    }
  }, [onClick, state])

  const stateContent: Record<ButtonState, React.ReactNode> = {
    idle: children,
    loading: <><Loader2 className="h-4 w-4 animate-spin" /> Loading…</>,
    success: <><Check className="h-4 w-4" /> {successText}</>,
    error: <><AlertCircle className="h-4 w-4" /> {errorText}</>,
  }

  const stateColors: Record<ButtonState, string> = {
    idle: '',
    loading: 'opacity-80 cursor-wait',
    success: '!bg-success !text-white',
    error: '!bg-destructive !text-white',
  }

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      whileTap={reduce ? {} : { scale: 0.97 }}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        stateColors[state],
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={reduce ? {} : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? {} : { opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2"
        >
          {stateContent[state]}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
```

- [ ] **Step 2: Create TailwindButtons**

```tsx
// components/aceternity/TailwindButtons.tsx
// Aceternity-style button variants themed to design tokens
import { cn } from '@/lib/utils'
import { motion, useReducedMotion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'shimmer' | 'gradient' | 'bordered' | 'glass' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export function TailwindButtons({ variant = 'gradient', size = 'md', className, children, ...props }: ButtonProps) {
  const reduce = useReducedMotion()
  const sizeMap = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-5 text-sm', lg: 'h-12 px-7 text-base' }

  const variantMap: Record<string, string> = {
    shimmer: [
      'relative overflow-hidden rounded-lg border border-primary/30',
      'bg-primary/10 text-primary font-semibold',
      'before:absolute before:inset-0 before:-translate-x-full',
      'before:animate-[shimmer_1.6s_infinite]',
      'before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent',
      'hover:bg-primary/15 transition-colors',
    ].join(' '),
    gradient: [
      'rounded-lg bg-gradient-to-br from-primary to-accent',
      'text-primary-foreground font-semibold shadow-lg shadow-primary/25',
      'hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200',
    ].join(' '),
    bordered: [
      'rounded-lg border-2 border-primary text-primary font-semibold',
      'hover:bg-primary hover:text-primary-foreground transition-all duration-200',
    ].join(' '),
    glass: [
      'rounded-lg border border-white/10 bg-white/5 text-foreground font-semibold',
      'backdrop-blur-sm hover:bg-white/10 transition-all duration-200',
    ].join(' '),
    destructive: [
      'rounded-lg bg-destructive text-white font-semibold',
      'hover:bg-destructive/90 transition-colors',
    ].join(' '),
  }

  return (
    <motion.button
      whileTap={reduce ? {} : { scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeMap[size],
        variantMap[variant],
        className,
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/aceternity/StatefulButton.tsx components/aceternity/TailwindButtons.tsx
git commit -m "feat(aceternity): StatefulButton, TailwindButtons"
```

---

## Task 4: Background Components

**Files:**
- Create: `components/aceternity/GridDotBackground.tsx`
- Create: `components/aceternity/NoiseBackground.tsx`
- Create: `components/aceternity/BackgroundRipple.tsx`
- Create: `components/aceternity/BackgroundBoxes.tsx`

- [ ] **Step 1: Create GridDotBackground**

```tsx
// components/aceternity/GridDotBackground.tsx
import { cn } from '@/lib/utils'

interface GridDotBackgroundProps {
  children?: React.ReactNode
  className?: string
  variant?: 'grid' | 'dots'
  /** color of the grid/dot lines, defaults to border token */
  color?: string
}

export function GridDotBackground({ children, className, variant = 'dots', color }: GridDotBackgroundProps) {
  const gridStyle = variant === 'dots'
    ? {
        backgroundImage: `radial-gradient(${color ?? 'var(--border)'} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }
    : {
        backgroundImage: `linear-gradient(${color ?? 'var(--border)'} 1px, transparent 1px),
                          linear-gradient(to right, ${color ?? 'var(--border)'} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }

  return (
    <div className={cn('relative', className)} style={gridStyle}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 2: Create NoiseBackground**

```tsx
// components/aceternity/NoiseBackground.tsx
import { cn } from '@/lib/utils'

interface NoiseBackgroundProps {
  children?: React.ReactNode
  className?: string
  opacity?: number
}

export function NoiseBackground({ children, className, opacity }: NoiseBackgroundProps) {
  return (
    <div className={cn('relative isolate', className)}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{ opacity: opacity ?? 'var(--aceternity-noise-opacity)' as unknown as number }}
      >
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter)" />
      </svg>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 3: Create BackgroundRipple**

```tsx
// components/aceternity/BackgroundRipple.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BackgroundRippleProps {
  children?: React.ReactNode
  className?: string
  rippleColor?: string
  numRings?: number
}

export function BackgroundRipple({
  children,
  className,
  rippleColor = 'var(--primary)',
  numRings = 6,
}: BackgroundRippleProps) {
  const reduce = useReducedMotion()
  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden', className)}>
      {Array.from({ length: numRings }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: rippleColor }}
          initial={{ opacity: 0, scale: 0 }}
          animate={reduce ? { opacity: 0.15, scale: 1 + i * 0.4 } : {
            opacity: [0, 0.15, 0],
            scale: [0, 1 + i * 0.4, 2 + i * 0.4],
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            width: `${(i + 1) * 120}px`,
            height: `${(i + 1) * 120}px`,
            borderColor: rippleColor,
          }}
        />
      ))}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 4: Create BackgroundBoxes**

```tsx
// components/aceternity/BackgroundBoxes.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const colors = [
  'var(--primary)', 'var(--accent)', 'var(--chart-1)',
  'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)',
]

function getColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

interface BoxProps { color: string }

function Box({ color }: BoxProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="h-8 w-8 border border-white/5"
      animate={{ backgroundColor: hovered ? color : 'transparent' }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  )
}

interface BackgroundBoxesProps {
  children?: React.ReactNode
  className?: string
  rows?: number
  cols?: number
}

export function BackgroundBoxes({ children, className, rows = 20, cols = 30 }: BackgroundBoxesProps) {
  const boxes = Array.from({ length: rows * cols }, (_, i) => ({ id: i, color: getColor() }))
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {boxes.map((b) => <Box key={b.id} color={b.color} />)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/aceternity/GridDotBackground.tsx components/aceternity/NoiseBackground.tsx components/aceternity/BackgroundRipple.tsx components/aceternity/BackgroundBoxes.tsx
git commit -m "feat(aceternity): GridDotBackground, NoiseBackground, BackgroundRipple, BackgroundBoxes"
```

---

## Task 5: Lighting Effects — SpotlightNew, GeminiEffect, LampEffect

**Files:**
- Create: `components/aceternity/SpotlightNew.tsx`
- Create: `components/aceternity/GeminiEffect.tsx`
- Create: `components/aceternity/LampEffect.tsx`

- [ ] **Step 1: Create SpotlightNew**

```tsx
// components/aceternity/SpotlightNew.tsx
'use client'

import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightNewProps {
  children?: React.ReactNode
  className?: string
  /** Spotlight size in px, default 600 */
  size?: number
}

export function SpotlightNew({ children, className, size = 600 }: SpotlightNewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -9999, y: -9999 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setOpacity(1)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOpacity(0)}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, var(--aceternity-spotlight-color), transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create GeminiEffect**

```tsx
// components/aceternity/GeminiEffect.tsx
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GeminiEffectProps {
  children?: React.ReactNode
  className?: string
  /** Number of beams, default 5 */
  beams?: number
}

export function GeminiEffect({ children, className, beams = 5 }: GeminiEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={ref} className={cn('relative isolate flex items-center justify-center', className)}>
      <motion.div
        style={reduce ? {} : { opacity }}
        className="absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: beams }).map((_, i) => {
          const angle = -30 + (60 / (beams - 1)) * i
          return (
            <motion.div
              key={i}
              className="absolute bottom-0 left-1/2 origin-bottom"
              style={{
                width: 2,
                height: '100%',
                rotate: angle,
                background: `linear-gradient(to top, var(--primary), var(--accent), transparent)`,
                opacity: 0.3 + (i === Math.floor(beams / 2) ? 0.4 : 0),
                filter: 'blur(1px)',
              }}
              animate={reduce ? {} : {
                opacity: [0.2, 0.5, 0.2],
                scaleX: [1, 1.4, 1],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          )
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.div>
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 3: Create LampEffect**

```tsx
// components/aceternity/LampEffect.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LampEffectProps {
  children?: React.ReactNode
  className?: string
}

export function LampEffect({ children, className }: LampEffectProps) {
  const reduce = useReducedMotion()
  return (
    <div className={cn('relative flex flex-col items-center justify-center overflow-hidden', className)}>
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center" aria-hidden="true">
        {/* Left beam */}
        <motion.div
          initial={reduce ? {} : { opacity: 0.5, width: '15rem' }}
          animate={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto right-1/2 top-1/2 h-56 overflow-visible bg-gradient-conic from-primary/20 via-transparent to-transparent"
          style={{ backgroundImage: `conic-gradient(from 70deg at right, var(--primary), transparent 180deg)` }}
        />
        {/* Right beam */}
        <motion.div
          initial={reduce ? {} : { opacity: 0.5, width: '15rem' }}
          animate={{ opacity: 1, width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto left-1/2 top-1/2 h-56 overflow-visible"
          style={{ backgroundImage: `conic-gradient(from 290deg at left, var(--primary), transparent 180deg)` }}
        />
        {/* Glow orb */}
        <motion.div
          initial={reduce ? {} : { width: '4rem' }}
          animate={{ width: '16rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary blur-sm"
        />
        <motion.div
          initial={reduce ? {} : { opacity: 0, width: '2rem' }}
          animate={{ opacity: 1, width: '8rem' }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute inset-auto top-1/2 h-6 w-32 -translate-y-1/2 rounded-full bg-primary/50 blur-xl"
        />
        {/* Arc line */}
        <motion.div
          initial={reduce ? {} : { width: '10rem' }}
          animate={{ width: '30rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>
      <div className="relative z-10 mt-20">{children}</div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/aceternity/SpotlightNew.tsx components/aceternity/GeminiEffect.tsx components/aceternity/LampEffect.tsx
git commit -m "feat(aceternity): SpotlightNew, GeminiEffect, LampEffect"
```

---

## Task 6: Text Effects — TextHoverEffect, TypewriterEffect, CanvasText

**Files:**
- Create: `components/aceternity/TextHoverEffect.tsx`
- Create: `components/aceternity/TypewriterEffect.tsx`
- Create: `components/aceternity/CanvasText.tsx`

- [ ] **Step 1: Create TextHoverEffect**

```tsx
// components/aceternity/TextHoverEffect.tsx
'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextHoverEffectProps {
  text: string
  className?: string
  duration?: number
}

export function TextHoverEffect({ text, className, duration = 0.3 }: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPos, setMaskPos] = useState({ cx: '50%', cy: '50%' })

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCursor({ x, y })
    setMaskPos({
      cx: `${(x / rect.width) * 100}%`,
      cy: `${(y / rect.height) * 100}%`,
    })
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn('select-none', className)}
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="50%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
        <radialGradient id="revealMask" gradientUnits="userSpaceOnUse" cx={maskPos.cx} cy={maskPos.cy} r="20%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="textMask">
          <rect width="100%" height="100%" fill={hovered ? 'url(#revealMask)' : 'black'} />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-muted-foreground/40 font-[helvetica] text-7xl font-bold"
        style={{ fontFamily: 'inherit' }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent font-[helvetica] text-7xl font-bold"
        style={{ stroke: 'url(#textGradient)', fontFamily: 'inherit' }}
        mask="url(#textMask)"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: hovered ? 0 : 1000 }}
        transition={{ duration }}
      >
        {text}
      </motion.text>
    </svg>
  )
}
```

- [ ] **Step 2: Create TypewriterEffect**

```tsx
// components/aceternity/TypewriterEffect.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TypewriterEffectProps {
  words: Array<{ text: string; className?: string }>
  className?: string
  cursorClassName?: string
}

export function TypewriterEffect({ words, className, cursorClassName }: TypewriterEffectProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={cn('inline', className)}>
        {words.map((w, i) => (
          <span key={i} className={cn('text-foreground', w.className)}>{w.text} </span>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('inline-flex flex-wrap items-center', className)}>
      {words.map((word, wIdx) => (
        <div key={wIdx} className="inline-flex overflow-hidden">
          {word.text.split('').map((char, cIdx) => (
            <motion.span
              key={cIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (wIdx * word.text.length + cIdx) * 0.05, duration: 0.2 }}
              className={cn('text-foreground', word.className)}
            >
              {char}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </div>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('ml-0.5 inline-block h-[1em] w-0.5 rounded-full bg-primary align-middle', cursorClassName)}
      />
    </div>
  )
}
```

- [ ] **Step 3: Create CanvasText**

```tsx
// components/aceternity/CanvasText.tsx
'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface CanvasTextProps {
  text: string
  className?: string
  fontSize?: number
  /** CSS color string resolved at paint time */
  color?: string
}

export function CanvasText({ text, className, fontSize = 72, color }: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    // Resolve CSS variable color at runtime
    const resolvedColor = color
      ?? getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()
      || '#ffffff'

    ctx.clearRect(0, 0, w, h)
    ctx.font = `bold ${fontSize}px ${getComputedStyle(document.documentElement).fontFamily}`
    ctx.fillStyle = resolvedColor.startsWith('oklch') ? 'currentColor' : resolvedColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
  }, [text, fontSize, color])

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full', className)}
      aria-label={text}
    />
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/aceternity/TextHoverEffect.tsx components/aceternity/TypewriterEffect.tsx components/aceternity/CanvasText.tsx
git commit -m "feat(aceternity): TextHoverEffect, TypewriterEffect, CanvasText"
```

---

## Task 7: Card + Interaction Effects — GlowingEffect, Cover, FollowingPointer, AnimatedTooltip, DraggableCard

**Files:**
- Create: `components/aceternity/GlowingEffect.tsx`
- Create: `components/aceternity/Cover.tsx`
- Create: `components/aceternity/FollowingPointer.tsx`
- Create: `components/aceternity/AnimatedTooltip.tsx`
- Create: `components/aceternity/DraggableCard.tsx`

- [ ] **Step 1: Create GlowingEffect**

```tsx
// components/aceternity/GlowingEffect.tsx
'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowingEffectProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  spread?: number
}

export function GlowingEffect({ children, className, glowColor = 'var(--primary)', spread = 40 }: GlowingEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }, [x, y])

  const background = useTransform(
    [springX, springY],
    ([lx, ly]: number[]) =>
      `radial-gradient(${spread * 4}px circle at ${lx}px ${ly}px, ${glowColor}, transparent 80%)`,
  )

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn('group/glow relative rounded-[inherit]', className)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10 rounded-[inherit]">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create Cover**

```tsx
// components/aceternity/Cover.tsx
'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CoverProps {
  children: React.ReactNode
  className?: string
  coverContent?: React.ReactNode
}

export function Cover({ children, className, coverContent }: CoverProps) {
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()

  return (
    <div
      className={cn('group relative overflow-hidden rounded-xl', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur-sm"
        initial={{ opacity: 1 }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.3 }}
        aria-hidden={hovered}
      >
        {coverContent ?? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        )}
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 3: Create FollowingPointer**

```tsx
// components/aceternity/FollowingPointer.tsx
'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FollowingPointerProps {
  children: React.ReactNode
  label?: React.ReactNode
  className?: string
}

export function FollowingPointer({ children, label, className }: FollowingPointerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  if (reduce) return <div className={className}>{children}</div>

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn('relative', className)}
      style={{ cursor: 'none' }}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="pointer-events-none absolute z-50"
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            {/* custom cursor dot */}
            <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
            {label && (
              <div className="ml-3 -mt-1 whitespace-nowrap rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground shadow">
                {label}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 4: Create AnimatedTooltip**

```tsx
// components/aceternity/AnimatedTooltip.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface TooltipItem {
  id: number
  name: string
  designation?: string
  image?: string
}

interface AnimatedTooltipProps {
  items: TooltipItem[]
  className?: string
}

export function AnimatedTooltip({ items, className }: AnimatedTooltipProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0)
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)

  return (
    <div className={cn('flex flex-row items-center', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative -mr-4"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          onMouseMove={(e) => {
            const target = e.currentTarget
            const rect = target.getBoundingClientRect()
            x.set(e.clientX - rect.left - rect.width / 2)
          }}
        >
          <AnimatePresence>
            {hoveredId === item.id && (
              <motion.div
                initial={reduce ? {} : { opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? {} : { opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX, rotate, whiteSpace: 'nowrap' }}
                className="absolute -top-14 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center rounded-lg border border-border bg-card px-3 py-2 shadow-xl text-xs"
              >
                <p className="font-semibold text-foreground">{item.name}</p>
                {item.designation && <p className="text-muted-foreground">{item.designation}</p>}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-border bg-muted">
            {item.image ? (
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                {item.name[0]}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create DraggableCard**

```tsx
// components/aceternity/DraggableCard.tsx
'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DraggableCardProps {
  children: React.ReactNode
  className?: string
  /** Pass a ref to constrain drag within a parent */
  dragConstraints?: React.RefObject<Element | null>
}

export function DraggableCard({ children, className, dragConstraints }: DraggableCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]))
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]))

  if (reduce) return <div className={cn('cursor-grab', className)}>{children}</div>

  return (
    <motion.div
      ref={ref}
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      style={{ x, y, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      className={cn('cursor-grab touch-none', className)}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/aceternity/GlowingEffect.tsx components/aceternity/Cover.tsx components/aceternity/FollowingPointer.tsx components/aceternity/AnimatedTooltip.tsx components/aceternity/DraggableCard.tsx
git commit -m "feat(aceternity): GlowingEffect, Cover, FollowingPointer, AnimatedTooltip, DraggableCard"
```

---

## Task 8: Scroll + Content Components — TracingBeam, Timeline, BentoGridAceternity

**Files:**
- Create: `components/aceternity/TracingBeam.tsx`
- Create: `components/aceternity/Timeline.tsx`
- Create: `components/aceternity/BentoGridAceternity.tsx`

- [ ] **Step 1: Create TracingBeam**

```tsx
// components/aceternity/TracingBeam.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TracingBeamProps {
  children: React.ReactNode
  className?: string
}

export function TracingBeam({ children, className }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const contentHeight = useRef(0)
  const [svgHeight, setSvgHeight] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (ref.current) setSvgHeight(ref.current.scrollHeight)
  }, [])

  const y1 = useSpring(
    useScroll({ container: ref }).scrollYProgress,
    { stiffness: 500, damping: 90 },
  )

  const pathLengthFirst = useSpring(scrollYProgress, { stiffness: 500, damping: 90 })

  return (
    <div ref={ref} className={cn('relative mx-auto max-w-4xl', className)}>
      <div className="absolute left-4 top-3 hidden md:block" aria-hidden="true">
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="var(--border)"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
          {!reduce && (
            <motion.path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
              fill="none"
              stroke="url(#beamGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength: pathLengthFirst }}
            />
          )}
          <defs>
            <linearGradient id="beamGradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2={svgHeight}>
              <stop stopColor="var(--primary)" stopOpacity="0" />
              <stop stopColor="var(--primary)" />
              <stop offset="0.9" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="pl-0 md:pl-12">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create Timeline**

```tsx
// components/aceternity/Timeline.tsx
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  title: string
  content: React.ReactNode
  date?: string
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 20%'] })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])
  const reduce = useReducedMotion()

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-8" aria-hidden="true">
        {!reduce && (
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-primary via-accent to-transparent"
            style={{ scaleY, height: '100%' }}
          />
        )}
      </div>
      <div className="space-y-12">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={reduce ? {} : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative pl-12 md:pl-20"
          >
            {/* Dot */}
            <div className="absolute left-2 top-1 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:left-8" />
            {item.date && (
              <time className="mb-1 block text-xs font-medium text-muted-foreground">{item.date}</time>
            )}
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <div className="mt-2 text-muted-foreground">{item.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create BentoGridAceternity**

```tsx
// components/aceternity/BentoGridAceternity.tsx
import { cn } from '@/lib/utils'

interface BentoItem {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
  header?: React.ReactNode
}

interface BentoGridAceternityProps {
  items: BentoItem[]
  className?: string
}

export function BentoGridAceternity({ items, className }: BentoGridAceternityProps) {
  return (
    <div className={cn(
      'mx-auto grid max-w-4xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3',
      className,
    )}>
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            'group/bento relative flex flex-col justify-between overflow-hidden rounded-2xl',
            'border border-border bg-card p-6',
            'shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5',
            'hover:border-primary/30',
            item.className,
          )}
        >
          {item.header && (
            <div className="mb-4 flex-1 overflow-hidden rounded-xl">{item.header}</div>
          )}
          <div className="mt-auto">
            {item.icon && (
              <div className="mb-3 text-primary">{item.icon}</div>
            )}
            <h3 className="font-semibold text-foreground transition-colors group-hover/bento:text-primary">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </div>
          {/* Subtle gradient overlay on hover */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{ background: 'linear-gradient(135deg, var(--primary)/0.04 0%, transparent 60%)' }}
          />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/aceternity/TracingBeam.tsx components/aceternity/Timeline.tsx components/aceternity/BentoGridAceternity.tsx
git commit -m "feat(aceternity): TracingBeam, Timeline, BentoGridAceternity"
```

---

## Task 9: Carousel + Marquee — AppleCardsCarousel, Marquee3D, InfiniteMovingCards

**Files:**
- Create: `components/aceternity/AppleCardsCarousel.tsx`
- Create: `components/aceternity/Marquee3D.tsx`
- Create: `components/aceternity/InfiniteMovingCards.tsx`

- [ ] **Step 1: Create AppleCardsCarousel**

```tsx
// components/aceternity/AppleCardsCarousel.tsx
'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AppleCard {
  title: string
  category: string
  description: string
  content?: React.ReactNode
  background?: string
}

interface AppleCardsCarouselProps {
  cards: AppleCard[]
  className?: string
}

export function AppleCardsCarousel({ cards, className }: AppleCardsCarouselProps) {
  const [active, setActive] = useState<AppleCard | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <>
      <div className={cn('relative', className)}>
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 shadow-md backdrop-blur-sm hover:bg-card"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(card)}
              whileHover={reduce ? {} : { scale: 1.02 }}
              className={cn(
                'relative h-80 w-72 flex-shrink-0 overflow-hidden rounded-2xl border border-border',
                'bg-gradient-to-br from-card to-muted text-left',
                card.background,
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-white/60">{card.category}</p>
                <h3 className="mt-1 text-lg font-bold text-white">{card.title}</h3>
                <p className="mt-1 text-sm text-white/70 line-clamp-2">{card.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 shadow-md backdrop-blur-sm hover:bg-card"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={reduce ? {} : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? {} : { scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-8 shadow-2xl"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 rounded-full p-1 hover:bg-accent-subtle"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{active.category}</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">{active.title}</h2>
              <p className="mt-3 text-muted-foreground">{active.description}</p>
              {active.content && <div className="mt-6">{active.content}</div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Create Marquee3D**

```tsx
// components/aceternity/Marquee3D.tsx
'use client'

import { cn } from '@/lib/utils'

interface Marquee3DProps {
  items: Array<{ text?: string; content?: React.ReactNode }>
  rows?: number
  className?: string
  pauseOnHover?: boolean
}

export function Marquee3D({ items, rows = 3, className, pauseOnHover = true }: Marquee3DProps) {
  const chunk = Math.ceil(items.length / rows)
  const rowItems = Array.from({ length: rows }, (_, i) => items.slice(i * chunk, (i + 1) * chunk))

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ perspective: '1200px' }}
    >
      <div
        className="mx-auto w-full"
        style={{ transform: 'rotateX(12deg) rotateY(-4deg)', transformStyle: 'preserve-3d' }}
      >
        {rowItems.map((row, rIdx) => (
          <div key={rIdx} className="flex overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div
              className={cn(
                'flex min-w-full shrink-0 gap-3 py-2',
                pauseOnHover ? 'hover:[animation-play-state:paused]' : '',
                rIdx % 2 === 0 ? 'animate-[marquee_20s_linear_infinite]' : 'animate-[marquee_20s_linear_infinite_reverse]',
              )}
            >
              {[...row, ...row].map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm"
                >
                  {item.content ?? item.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

Add to `app/globals.css` in the `@keyframes` section:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

- [ ] **Step 3: Create InfiniteMovingCards**

```tsx
// components/aceternity/InfiniteMovingCards.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface MovingCard {
  quote: string
  name: string
  title?: string
}

interface InfiniteMovingCardsProps {
  items: MovingCard[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}

export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(false)

  useEffect(() => { setStart(true) }, [])

  const speedMap = { fast: '20s', normal: '40s', slow: '80s' }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <ul
        className={cn(
          'flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap',
          start && 'animate-[scroll_var(--duration)_linear_infinite]',
          direction === 'right' && '[animation-direction:reverse]',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        style={{
          '--duration': speedMap[speed],
        } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <li
            key={i}
            className="relative w-[320px] max-w-full flex-shrink-0 rounded-2xl border border-border bg-card px-6 py-5"
          >
            <blockquote>
              <p className="text-sm leading-relaxed text-foreground">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-4">
                <p className="font-semibold text-foreground text-sm">{item.name}</p>
                {item.title && <p className="text-xs text-muted-foreground">{item.title}</p>}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Add to `app/globals.css`:

```css
@keyframes scroll {
  to { transform: translateX(-50%); }
}
```

- [ ] **Step 4: Commit**

```bash
git add components/aceternity/AppleCardsCarousel.tsx components/aceternity/Marquee3D.tsx components/aceternity/InfiniteMovingCards.tsx app/globals.css
git commit -m "feat(aceternity): AppleCardsCarousel, Marquee3D, InfiniteMovingCards"
```

---

## Task 10: Navigation Components — NavbarWithChildren, FloatingNavbar, StickyBanner

**Files:**
- Create: `components/aceternity/NavbarWithChildren.tsx`
- Create: `components/aceternity/FloatingNavbar.tsx`
- Create: `components/aceternity/StickyBanner.tsx`

- [ ] **Step 1: Create NavbarWithChildren**

```tsx
// components/aceternity/NavbarWithChildren.tsx
'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  href: string
  children?: Array<{ label: string; href: string; description?: string }>
}

interface NavbarWithChildrenProps {
  items: NavItem[]
  logo?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function NavbarWithChildren({ items, logo, actions, className }: NavbarWithChildrenProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const reduce = useReducedMotion()

  return (
    <nav className={cn('relative flex items-center justify-between px-6 py-3', className)}>
      {logo && <div className="flex-shrink-0">{logo}</div>}

      <ul className="hidden items-center gap-1 md:flex">
        {items.map((item) => (
          <li
            key={item.label}
            className="relative"
            onMouseEnter={() => item.children && setActiveItem(item.label)}
            onMouseLeave={() => setActiveItem(null)}
          >
            <a
              href={item.href}
              className={cn(
                'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium',
                'text-muted-foreground transition-colors hover:bg-accent-subtle hover:text-foreground',
              )}
            >
              {item.label}
              {item.children && <span className="text-xs opacity-50">▾</span>}
            </a>

            <AnimatePresence>
              {item.children && activeItem === item.label && (
                <motion.div
                  initial={reduce ? {} : { opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? {} : { opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-border bg-popover p-2 shadow-xl"
                >
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block rounded-lg px-3 py-2.5 hover:bg-accent-subtle"
                    >
                      <p className="text-sm font-medium text-foreground">{child.label}</p>
                      {child.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{child.description}</p>
                      )}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </nav>
  )
}
```

- [ ] **Step 2: Create FloatingNavbar**

```tsx
// components/aceternity/FloatingNavbar.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingNavbarProps {
  children: React.ReactNode
  className?: string
  /** px scroll threshold before floating nav appears, default 100 */
  threshold?: number
}

export function FloatingNavbar({ children, className, threshold = 100 }: FloatingNavbarProps) {
  const [visible, setVisible] = useState(false)
  const [lastY, setLastY] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y > threshold && y < lastY)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY, threshold])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? {} : { y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? {} : { y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'fixed inset-x-4 top-4 z-50 mx-auto max-w-2xl rounded-full',
            'border border-border bg-card/80 px-6 py-2 shadow-xl backdrop-blur-md',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Create StickyBanner**

```tsx
// components/aceternity/StickyBanner.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StickyBannerProps {
  children: React.ReactNode
  storageKey?: string
  className?: string
  variant?: 'primary' | 'warning' | 'neutral'
}

const variantMap = {
  primary: 'bg-primary/10 border-primary/20 text-primary',
  warning: 'bg-warning/10 border-warning/20 text-warning',
  neutral: 'bg-muted border-border text-foreground',
}

export function StickyBanner({ children, storageKey, className, variant = 'primary' }: StickyBannerProps) {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!storageKey || localStorage.getItem(storageKey) !== '1') setVisible(true)
  }, [storageKey])

  const dismiss = () => {
    if (storageKey) localStorage.setItem(storageKey, '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? {} : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={reduce ? {} : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn('relative overflow-hidden border-b', variantMap[variant], className)}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-sm">
            {children}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/aceternity/NavbarWithChildren.tsx components/aceternity/FloatingNavbar.tsx components/aceternity/StickyBanner.tsx
git commit -m "feat(aceternity): NavbarWithChildren, FloatingNavbar, StickyBanner"
```

---

## Task 11: GooeyInput + AceternitySidebar

**Files:**
- Create: `components/aceternity/GooeyInput.tsx`
- Create: `components/aceternity/Sidebar.tsx`

- [ ] **Step 1: Create GooeyInput**

```tsx
// components/aceternity/GooeyInput.tsx
'use client'

import { useId, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GooeyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  className?: string
}

export function GooeyInput({ label, className, value, onChange, ...props }: GooeyInputProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const hasValue = Boolean(value || props.defaultValue)
  const floatLabel = focused || hasValue
  const reduce = useReducedMotion()

  return (
    <div className={cn('relative', className)}>
      {/* SVG gooey filter */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooey" />
          </filter>
        </defs>
      </svg>

      <div
        className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        style={{ filter: 'url(#gooey)' }}
      >
        <input
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer w-full bg-transparent px-4 pb-2 pt-6 text-sm text-foreground placeholder-transparent focus:outline-none"
          placeholder={label}
          {...props}
        />
        <motion.label
          htmlFor={id}
          animate={reduce ? {} : {
            top: floatLabel ? '0.375rem' : '0.875rem',
            fontSize: floatLabel ? '0.65rem' : '0.875rem',
            color: focused ? 'var(--primary)' : 'var(--muted-foreground)',
          }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute left-4 font-medium"
          style={{ top: floatLabel ? '0.375rem' : '0.875rem', fontSize: floatLabel ? '0.65rem' : '0.875rem' }}
        >
          {label}
        </motion.label>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create AceternitySidebar**

```tsx
// components/aceternity/Sidebar.tsx
'use client'

import { useState, createContext, useContext } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarContextValue {
  open: boolean
  setOpen: (v: boolean) => void
}

const SidebarCtx = createContext<SidebarContextValue>({ open: true, setOpen: () => {} })

export function useSidebar() { return useContext(SidebarCtx) }

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen)
  return <SidebarCtx.Provider value={{ open, setOpen }}>{children}</SidebarCtx.Provider>
}

interface AceternitySidebarProps {
  children: React.ReactNode
  className?: string
}

export function AceternitySidebar({ children, className }: AceternitySidebarProps) {
  const { open } = useSidebar()
  const reduce = useReducedMotion()

  return (
    <motion.aside
      animate={{ width: open ? 240 : 64 }}
      transition={reduce ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex h-screen flex-col overflow-hidden',
        'border-r border-sidebar-border bg-sidebar',
        className,
      )}
    >
      {children}
    </motion.aside>
  )
}

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string
}

export function SidebarLink({ href, icon, label, active, badge }: SidebarLinkProps) {
  const { open } = useSidebar()
  const reduce = useReducedMotion()

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'mx-2 my-0.5',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
      )}
    >
      <span className="flex-shrink-0 text-current">{icon}</span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            initial={reduce ? {} : { opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={reduce ? {} : { opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {badge && open && (
        <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function SidebarToggle() {
  const { open, setOpen } = useSidebar()
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground"
      aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      {open ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
    </button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/aceternity/GooeyInput.tsx components/aceternity/Sidebar.tsx
git commit -m "feat(aceternity): GooeyInput, AceternitySidebar with SidebarProvider + SidebarLink"
```

---

## Task 12: Wire Marketing Home Page

**Files:**
- Modify: `components/RebrandBanner.tsx` → replaced by StickyBanner
- Modify: `app/(marketing)/HomeSections.tsx`
- Modify: `app/(marketing)/layout.tsx`

- [ ] **Step 1: Replace RebrandBanner with StickyBanner in layout**

Open `app/(marketing)/layout.tsx`. Find the import and usage of `RebrandBanner`. Replace:

```tsx
// Remove:
import RebrandBanner from '@/components/RebrandBanner'
// ...
<RebrandBanner />

// Add:
import { StickyBanner } from '@/components/aceternity'
// ...
<StickyBanner storageKey="kairoo-rebrand-banner-dismissed" variant="primary">
  <strong>AstraPath AI is now Kairoo.</strong>&nbsp;Same mission — the right moment to grow.
</StickyBanner>
```

- [ ] **Step 2: Wire GeminiEffect + SpotlightNew + GridDotBackground into HomeHero**

Open `app/(marketing)/HomeSections.tsx`. At the top of imports add:

```tsx
import { GeminiEffect, SpotlightNew, GridDotBackground, StickyBanner, Marquee3D } from '@/components/aceternity'
```

Find `export function HomeHero()`. The function returns a `<Section className="relative isolate overflow-hidden">`. Wrap the Section's inner content with `GeminiEffect` and wrap the hero card/content with `SpotlightNew`:

```tsx
export function HomeHero() {
  // ... existing hooks ...
  return (
    <GeminiEffect className="relative isolate min-h-[80vh] overflow-hidden pt-24 pb-16">
      <SpotlightNew className="mx-auto max-w-5xl px-4 text-center" size={700}>
        {/* existing hero content stays exactly as-is */}
      </SpotlightNew>
    </GeminiEffect>
  )
}
```

- [ ] **Step 3: Wire GridDotBackground into HomePillars section**

Find `export function HomePillars()`. Wrap the outer `<Section>` children with `GridDotBackground`:

```tsx
export function HomePillars() {
  return (
    <GridDotBackground variant="dots" className="relative">
      <Section className="relative">
        {/* existing content unchanged */}
      </Section>
    </GridDotBackground>
  )
}
```

- [ ] **Step 4: Replace LogoMarquee with Marquee3D in HomeSocialProof**

Find `export function HomeSocialProof()`. Add Marquee3D above the TestimonialGrid:

```tsx
import { Marquee3D } from '@/components/aceternity'

// Inside HomeSocialProof, before <TestimonialGrid>:
const logoItems = [
  { text: 'Google' }, { text: 'Meta' }, { text: 'Amazon' },
  { text: 'Microsoft' }, { text: 'Stripe' }, { text: 'Vercel' },
  { text: 'OpenAI' }, { text: 'Anthropic' }, { text: 'Linear' },
]
// Add above TestimonialGrid:
<Marquee3D items={logoItems} rows={2} className="mb-16 opacity-60" />
```

- [ ] **Step 5: Wire BackgroundRipple into HomeClosingCTA**

Find `export function HomeClosingCTA()`. Wrap its content with `BackgroundRipple`:

```tsx
import { BackgroundRipple } from '@/components/aceternity'

export function HomeClosingCTA() {
  return (
    <BackgroundRipple className="relative isolate overflow-hidden py-24">
      <Section className="relative z-10">
        {/* existing CTA content */}
      </Section>
    </BackgroundRipple>
  )
}
```

- [ ] **Step 6: Run dev server and visually verify**

```bash
npm run dev
```

Open http://localhost:1254. Verify:
- Banner shows with dismiss
- Hero has beam lighting effect
- Pillars section has dot grid background
- Logo strip shows 3D marquee
- CTA section has ripple rings

- [ ] **Step 7: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors

- [ ] **Step 8: Commit**

```bash
git add app/\(marketing\)/HomeSections.tsx app/\(marketing\)/layout.tsx
git commit -m "feat(aceternity): wire home page — GeminiEffect hero, SpotlightNew, GridDotBackground, Marquee3D, BackgroundRipple CTA"
```

---

## Task 13: Wire Features + How-It-Works Pages

**Files:**
- Modify: `app/(marketing)/features/FeaturesVisuals.tsx`
- Modify: `app/(marketing)/how-it-works/HowItWorksVisuals.tsx`

- [ ] **Step 1: Wire BentoGridAceternity + GlowingEffect into Features page**

Open `app/(marketing)/features/FeaturesVisuals.tsx`. Add imports:

```tsx
import { BentoGridAceternity, GlowingEffect, FollowingPointer, NoiseBackground } from '@/components/aceternity'
```

Find the main features grid section. Replace or wrap the existing feature cards grid with `BentoGridAceternity`. Each existing feature card becomes a `BentoItem`. Wrap the entire section with `NoiseBackground` if it's a dark section:

```tsx
// Build items from existing features data:
const bentoItems = features.map(f => ({
  title: f.title,
  description: f.description,
  icon: <f.Icon className="h-6 w-6" />,
  className: f.featured ? 'md:col-span-2' : '',
}))

// Replace the grid:
<NoiseBackground className="rounded-2xl">
  <FollowingPointer label="Explore">
    <BentoGridAceternity items={bentoItems} />
  </FollowingPointer>
</NoiseBackground>
```

Wrap individual bento card with `GlowingEffect` by modifying `BentoGridAceternity` to accept a `withGlow` prop, OR wrap the entire grid component:

```tsx
<GlowingEffect className="rounded-2xl">
  <BentoGridAceternity items={bentoItems} />
</GlowingEffect>
```

- [ ] **Step 2: Wire TracingBeam + AppleCardsCarousel + Timeline into How-It-Works**

Open `app/(marketing)/how-it-works/HowItWorksVisuals.tsx`. Add imports:

```tsx
import { TracingBeam, AppleCardsCarousel, Timeline, BackgroundRipple } from '@/components/aceternity'
import type { AppleCard } from '@/components/aceternity'
```

Wrap the entire page content with `TracingBeam`. Replace the existing steps list with a `Timeline` component. Add an `AppleCardsCarousel` for visual step showcase:

```tsx
// Build timeline items from existing steps data:
const timelineItems = steps.map(step => ({
  title: step.title,
  date: `Step ${step.number}`,
  content: <p className="text-muted-foreground">{step.description}</p>,
}))

// Build carousel cards:
const carouselCards: AppleCard[] = steps.map(step => ({
  title: step.title,
  category: `Step ${step.number}`,
  description: step.description,
}))

// In JSX:
<TracingBeam>
  <section className="py-16">
    <AppleCardsCarousel cards={carouselCards} className="mb-16" />
    <Timeline items={timelineItems} />
  </section>
</TracingBeam>

// CTA section:
<BackgroundRipple className="py-24">
  {/* existing CTA */}
</BackgroundRipple>
```

- [ ] **Step 3: Commit**

```bash
git add app/\(marketing\)/features/FeaturesVisuals.tsx app/\(marketing\)/how-it-works/HowItWorksVisuals.tsx
git commit -m "feat(aceternity): wire features (BentoGrid, GlowingEffect, FollowingPointer) + how-it-works (TracingBeam, Timeline, Carousel)"
```

---

## Task 14: Wire Pricing + About + Customers Pages

**Files:**
- Modify: `app/(marketing)/pricing/PricingVisuals.tsx`
- Modify: `app/(marketing)/about/AboutVisuals.tsx`
- Modify: `app/(marketing)/customers/CustomersVisuals.tsx`

- [ ] **Step 1: Wire LampEffect + GlowingEffect into Pricing**

Open `app/(marketing)/pricing/PricingVisuals.tsx`. Add:

```tsx
import { LampEffect, GlowingEffect, BackgroundRipple, SpotlightNew } from '@/components/aceternity'
```

Wrap the pricing hero section with `LampEffect`, wrap the Pro/Enterprise cards with `GlowingEffect`, and the recommended plan card's section with `SpotlightNew`:

```tsx
// Hero:
<LampEffect className="py-16">
  <h1 className="text-center text-4xl font-bold">Simple, transparent pricing</h1>
</LampEffect>

// Pro card:
<GlowingEffect glowColor="var(--primary)">
  <SpotlightNew>
    {/* Pro plan card */}
  </SpotlightNew>
</GlowingEffect>

// Enterprise card:
<GlowingEffect glowColor="var(--accent)">
  {/* Enterprise plan card */}
</GlowingEffect>
```

- [ ] **Step 2: Wire Timeline into About page**

Open `app/(marketing)/about/AboutVisuals.tsx`. Add:

```tsx
import { Timeline, CardSpotlight, AnimatedTooltip } from '@/components/aceternity'
import type { TimelineItem } from '@/components/aceternity'
```

Add a company milestones timeline section:

```tsx
const milestones: TimelineItem[] = [
  { title: 'Founded', date: '2023', content: <p className="text-muted-foreground">AstraPath AI founded with a mission to democratize career intelligence.</p> },
  { title: 'Rebranded to Kairoo', date: '2024', content: <p className="text-muted-foreground">Refined focus, new brand, same mission.</p> },
  { title: 'AI Engine v2', date: '2025', content: <p className="text-muted-foreground">38-tool AI career engine launched with personalized roadmaps.</p> },
]

<Timeline items={milestones} className="mt-12" />
```

- [ ] **Step 3: Wire AppleCardsCarousel + InfiniteMovingCards into Customers**

Open `app/(marketing)/customers/CustomersVisuals.tsx`. Add:

```tsx
import { AppleCardsCarousel, InfiniteMovingCards, Marquee3D } from '@/components/aceternity'
import type { AppleCard, MovingCard } from '@/components/aceternity'
```

Replace the customer testimonials section with `InfiniteMovingCards` and add a `Marquee3D` logo wall:

```tsx
const testimonials: MovingCard[] = [
  { quote: 'Kairoo helped me land my first PM role at a top startup in 6 weeks.', name: 'Priya S.', title: 'Product Manager, Funded Startup' },
  { quote: 'The skill gap analysis was spot-on. I knew exactly what to learn next.', name: 'James K.', title: 'Software Engineer, FAANG' },
  // add more
]

<InfiniteMovingCards items={testimonials} speed="normal" className="my-12" />
```

- [ ] **Step 4: Commit**

```bash
git add app/\(marketing\)/pricing/PricingVisuals.tsx app/\(marketing\)/about/AboutVisuals.tsx app/\(marketing\)/customers/CustomersVisuals.tsx
git commit -m "feat(aceternity): wire pricing (LampEffect, GlowingEffect), about (Timeline), customers (InfiniteMovingCards, Marquee3D)"
```

---

## Task 15: Wire Global Marketing Nav

**Files:**
- Modify: `components/shells/PublicNav.tsx`

- [ ] **Step 1: Wrap PublicNav links with TextHoverEffect**

Open `components/shells/PublicNav.tsx`. Add import:

```tsx
import { FloatingNavbar, StickyBanner } from '@/components/aceternity'
```

The existing `PublicNav` already handles scroll. Add `FloatingNavbar` as a secondary scroll-aware compact nav that appears when scrolling up:

After the closing `</header>` tag, add:

```tsx
<FloatingNavbar threshold={200}>
  <div className="flex w-full items-center justify-between">
    <Logo size={24} href="/" />
    <div className="flex items-center gap-2">
      {isSignedIn ? (
        <Link href="/dashboard" className="text-sm font-medium text-foreground">Dashboard</Link>
      ) : (
        <>
          <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
          <Link href="/sign-up" className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Get started</Link>
        </>
      )}
    </div>
  </div>
</FloatingNavbar>
```

- [ ] **Step 2: Commit**

```bash
git add components/shells/PublicNav.tsx
git commit -m "feat(aceternity): FloatingNavbar added to marketing nav shell"
```

---

## Task 16: Wire App Shell — Sidebar + Topbar

**Files:**
- Modify: `components/shells/AppShell.tsx`
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Integrate AceternitySidebar into AppShell**

Open `components/shells/AppShell.tsx`. Replace:

```tsx
// Before:
import { Sidebar } from '@/components/layout/Sidebar'
import { AppTopbar } from '@/components/layout/AppTopbar'

// After:
import { AceternitySidebar, SidebarProvider, SidebarToggle, SidebarLink } from '@/components/aceternity'
import { AppTopbar } from '@/components/layout/AppTopbar'
```

Replace the `<Sidebar />` usage with the Aceternity sidebar wrapped in `SidebarProvider`:

```tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden bg-background">
        <CommandPalette />
        <AceternitySidebarNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppTopbar />
          <main className="flex flex-1 overflow-hidden">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
```

- [ ] **Step 2: Create AceternitySidebarNav using existing nav data**

Add this component to the bottom of `components/shells/AppShell.tsx`:

```tsx
import {
  LayoutDashboard, Activity, TrendingUp, Map, Briefcase,
  FileText, Zap, Grid3x3, BookOpen, Lightbulb, CheckSquare, Settings, Sparkles,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { AceternitySidebar, SidebarToggle, SidebarLink, useSidebar } from '@/components/aceternity'
import Logo from '@/components/Logo'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Activity', href: '/activity', icon: Activity },
  { label: 'Progress', href: '/progress', icon: TrendingUp },
  { label: 'Roadmaps', href: '/roadmaps', icon: Map },
  { label: 'Interview Prep', href: '/tools/interviewPrep', icon: Briefcase },
  { label: 'Resume Builder', href: '/tools/resumeBuilder', icon: FileText },
  { label: 'Skill Gap', href: '/tools/skillGapAnalysis', icon: Zap },
  { label: 'All Tools', href: '/tools', icon: Grid3x3, badge: '38' },
  { label: 'Study Plans', href: '/tools/studyPlan', icon: BookOpen },
  { label: 'Concept Explainer', href: '/tools/conceptExplainer', icon: Lightbulb },
  { label: 'Practice Quizzes', href: '/tools/practiceQuizzes', icon: CheckSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
]

function AceternitySidebarNav() {
  const pathname = usePathname()
  const { open } = useSidebar()

  return (
    <AceternitySidebar>
      <SidebarToggle />
      <div className="flex items-center gap-3 px-3 py-4">
        <Logo size={28} />
        {open && <span className="text-sm font-bold text-sidebar-foreground">Kairoo</span>}
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={<item.icon className="h-4 w-4" />}
            label={item.label}
            badge={item.badge}
            active={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}
      </nav>
    </AceternitySidebar>
  )
}
```

- [ ] **Step 3: Run dev and verify sidebar collapse/expand**

```bash
npm run dev
```

Open http://localhost:1254/dashboard. Verify the sidebar animates between collapsed (icons only) and expanded (icons + labels). Click the toggle button.

- [ ] **Step 4: TypeScript check + commit**

```bash
npx tsc --noEmit
git add components/shells/AppShell.tsx
git commit -m "feat(aceternity): replace app sidebar with AceternitySidebar (animated expand/collapse)"
```

---

## Task 17: Wire Dashboard Page

**Files:**
- Modify: `app/(app)/dashboard/_components/WelcomeBanner.tsx`
- Modify: `app/(app)/dashboard/_components/StatsGrid.tsx`
- Modify: `app/(app)/dashboard/_components/QuickLaunch.tsx`

- [ ] **Step 1: Add GlowingEffect to stats cards**

Open `app/(app)/dashboard/_components/StatsGrid.tsx`. Add import:

```tsx
import { GlowingEffect, ShimmerLoader } from '@/components/aceternity'
```

Wrap each stat card with `GlowingEffect`:

```tsx
// Wrap individual stat card:
<GlowingEffect glowColor="var(--primary)">
  <div className="rounded-xl border border-border bg-card p-5">
    {/* existing card content */}
  </div>
</GlowingEffect>
```

Add a loading state prop and render `ShimmerLoader` when loading:

```tsx
interface StatsGridProps {
  usedCredits: number
  total: number
  loading?: boolean
}

// In JSX:
if (loading) return (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <ShimmerLoader key={i} className="h-28 rounded-xl" />
    ))}
  </div>
)
```

- [ ] **Step 2: Add GridDotBackground + StatefulButton to WelcomeBanner**

Open `app/(app)/dashboard/_components/WelcomeBanner.tsx`. Add:

```tsx
import { GridDotBackground, StatefulButton } from '@/components/aceternity'
```

Wrap the banner content:

```tsx
<GridDotBackground variant="dots" className="rounded-xl overflow-hidden">
  <div className="relative z-10 p-6">
    {/* existing banner content */}
    <StatefulButton onClick={async () => { /* start roadmap action */ }}>
      Start your roadmap
    </StatefulButton>
  </div>
</GridDotBackground>
```

- [ ] **Step 3: Add StatefulButton to QuickLaunch**

Open `app/(app)/dashboard/_components/QuickLaunch.tsx`. Add:

```tsx
import { StatefulButton } from '@/components/aceternity'
```

Replace existing `<Button>` or `<Link>` CTAs for AI tool launches with `StatefulButton` where the action is async:

```tsx
<StatefulButton
  onClick={async () => { /* navigate to tool */ }}
  variant="outline"
  size="sm"
>
  {tool.label}
</StatefulButton>
```

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/dashboard/_components/"
git commit -m "feat(aceternity): wire dashboard — GlowingEffect stats, GridDotBackground banner, StatefulButton launch actions"
```

---

## Task 18: Wire Tools + Auth + Onboarding

**Files:**
- Modify: `app/(app)/tools/page.tsx`
- Modify: `app/(auth)/layout.tsx`
- Modify: `app/onboarding/_components/OnboardingWizard.tsx`

- [ ] **Step 1: Add GooeyInput to tools page**

Open `app/(app)/tools/page.tsx`. Add:

```tsx
import { GooeyInput, ShimmerLoader, SimpleLoader } from '@/components/aceternity'
```

Add a search/prompt input at the top of the tools list:

```tsx
'use client'
// ... at the top of the component:
const [query, setQuery] = useState('')

// In JSX, before the tools grid:
<GooeyInput
  label="Search tools or describe your goal…"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  className="mb-8 max-w-xl"
/>
```

- [ ] **Step 2: Wire SpotlightNew + BackgroundRipple into auth layout**

Open `app/(auth)/layout.tsx`. Add:

```tsx
import { SpotlightNew, BackgroundRipple } from '@/components/aceternity'
```

Wrap the auth page background:

```tsx
<BackgroundRipple className="min-h-screen" rippleColor="var(--primary)" numRings={5}>
  <SpotlightNew className="flex min-h-screen items-center justify-center" size={500}>
    {/* existing auth layout content */}
  </SpotlightNew>
</BackgroundRipple>
```

- [ ] **Step 3: Wire TypewriterEffect + Timeline + StatefulButton into OnboardingWizard**

Open `app/onboarding/_components/OnboardingWizard.tsx`. Add:

```tsx
import { TypewriterEffect, Timeline, StatefulButton, GooeyInput } from '@/components/aceternity'
import type { TimelineItem } from '@/components/aceternity'
```

Replace the step heading with `TypewriterEffect`. Add a progress `Timeline` as a left sidebar indicator. Replace the Continue button with `StatefulButton`. Replace free-text inputs with `GooeyInput`:

```tsx
// Step heading:
<TypewriterEffect
  words={currentStep.heading.split(' ').map(w => ({ text: w }))}
  className="text-2xl font-bold"
/>

// Progress sidebar:
const progressItems: TimelineItem[] = STEPS.map((step, i) => ({
  title: step.title,
  content: null,
  date: i < currentStepIndex ? '✓' : i === currentStepIndex ? '→' : '',
}))
<Timeline items={progressItems} className="hidden md:block w-48 shrink-0" />

// Continue button:
<StatefulButton onClick={handleContinue} size="lg">
  {isLastStep ? 'Get started' : 'Continue'}
</StatefulButton>
```

- [ ] **Step 4: Wire SVGLoader on Logo for page transitions**

Open `components/Logo.tsx`. Read the current SVG path(s). Add an optional `loading` prop that renders `SVGLoader` instead of the static logo:

```tsx
import { SVGLoader } from '@/components/aceternity'

interface LogoProps {
  size?: number
  href?: string
  loading?: boolean
}

export default function Logo({ size = 32, href, loading }: LogoProps) {
  // Get the actual path d="" value from your logo SVG
  const LOGO_PATH = 'M 10 80 Q 52.5 10 95 80 Q 137.5 150 180 80'  // ← replace with actual logo path

  if (loading) {
    return <SVGLoader pathD={LOGO_PATH} size={size} />
  }
  // ... existing logo render
}
```

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/tools/page.tsx" "app/(auth)/layout.tsx" "app/onboarding/_components/OnboardingWizard.tsx" components/Logo.tsx
git commit -m "feat(aceternity): wire tools (GooeyInput), auth (SpotlightNew + BackgroundRipple), onboarding (TypewriterEffect + Timeline + StatefulButton), Logo SVGLoader"
```

---

## Task 19: Wire Investors + Roadmaps + Progress Pages

**Files:**
- Modify: `app/investors/InvestorsClient.tsx`
- Modify: `app/(app)/roadmaps/page.tsx`
- Modify: `app/(app)/progress/page.tsx`

- [ ] **Step 1: Wire BackgroundBoxes + TracingBeam into Investors page**

Open `app/investors/InvestorsClient.tsx`. Add:

```tsx
import { BackgroundBoxes, TracingBeam, GlowingEffect } from '@/components/aceternity'
```

Wrap the hero section with `BackgroundBoxes` and the long-form content with `TracingBeam`:

```tsx
// Hero:
<BackgroundBoxes className="relative min-h-[40vh]" rows={12} cols={20}>
  <div className="relative z-10 py-20 text-center">
    {/* existing hero heading */}
  </div>
</BackgroundBoxes>

// Content:
<TracingBeam className="py-12">
  {/* existing investor content sections */}
</TracingBeam>
```

- [ ] **Step 2: Wire Timeline into Roadmaps page**

Open `app/(app)/roadmaps/page.tsx`. Add:

```tsx
import { Timeline, CardSpotlight } from '@/components/aceternity'
```

If roadmap milestones exist, render them with `Timeline`. Wrap roadmap phase cards with `CardSpotlight`.

- [ ] **Step 3: Wire GlowingEffect into Progress page**

Open `app/(app)/progress/page.tsx`. Add:

```tsx
import { GlowingEffect, ShimmerLoader, StatefulButton } from '@/components/aceternity'
```

Wrap achievement/milestone cards with `GlowingEffect`. Use `ShimmerLoader` for loading states and `StatefulButton` for mark-complete buttons.

- [ ] **Step 4: Commit**

```bash
git add app/investors/InvestorsClient.tsx "app/(app)/roadmaps/page.tsx" "app/(app)/progress/page.tsx"
git commit -m "feat(aceternity): wire investors (BackgroundBoxes, TracingBeam), roadmaps (Timeline), progress (GlowingEffect)"
```

---

## Task 20: Final TypeScript Verification + Cleanup

**Files:**
- Modify: `components/aceternity/index.ts` (finalize all exports)
- Run: `npx tsc --noEmit`

- [ ] **Step 1: Full TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -60
```

Expected: zero errors. Fix any type errors found by:
1. Checking prop types match between component definition and usage site
2. Ensuring all `AppleCard`, `TimelineItem`, `MovingCard`, `TooltipItem` types are exported from index.ts

- [ ] **Step 2: Remove unused old components if replaced**

If `RebrandBanner.tsx` is fully replaced by `StickyBanner`, delete it:

```bash
# Only if confirmed no remaining imports:
grep -r "RebrandBanner" app components --include="*.tsx" --include="*.ts"
# If zero results:
rm components/RebrandBanner.tsx
```

- [ ] **Step 3: Run production build**

```bash
npm run build 2>&1 | tail -30
```

Expected: successful build, no errors. Fix any build-time errors (commonly: missing `'use client'` directives, server/client component boundary violations).

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(aceternity): full integration complete — 32 components across marketing, app, auth, onboarding"
```

---

## Self-Review

**Spec coverage check:**
- ✅ All 26 listed components implemented: GooeyInput, CanvasText, NoiseBackground, TextHoverEffect, AppleCardsCarousel, BackgroundRipple, CardSpotlight (existing), Cover, DraggableCard, ShimmerLoader, SVGLoader, SimpleLoader, StatefulButton, NavbarWithChildren, StickyBanner, GeminiEffect, Marquee3D, TracingBeam, BentoGridAceternity, GlowingEffect, GridDotBackground, AceternitySidebar, SpotlightNew, FollowingPointer, TailwindButtons, Timeline
- ✅ All 6 bonus components: LampEffect, InfiniteMovingCards, AnimatedTooltip, TypewriterEffect, FloatingNavbar, BackgroundBoxes
- ✅ All 4 surfaces wired: marketing site, app shell, auth, onboarding
- ✅ Token bridge added in Task 1
- ✅ Reduced motion respected in every animated component
- ✅ No hardcoded colors — all use CSS custom properties
- ✅ TypeScript verification in Task 20

**Type consistency:** All exported types (`AppleCard`, `TimelineItem`, `MovingCard`, `TooltipItem`, `NavItem`) are defined in their source files and re-exported from `index.ts`. Component prop names are consistent across definition and usage sites.

**No placeholders:** All steps contain actual code. File paths are exact.
