/**
 * Motion tokens — one vocabulary for every animation in Saathi.
 *
 * UI motion (taps, sheets, menus) stays under 300ms with strong ease-out.
 * Cinematic motion (scroll stories, hero reveals) is allowed to breathe.
 * Springs use Apple-style duration/bounce so they stay easy to reason about
 * and remain interruptible (they keep velocity when retargeted).
 */

export const ease = {
  /** Default for anything entering or responding — instant feedback. */
  out: [0.23, 1, 0.32, 1],
  /** Marketing / scroll storytelling — long, luxurious settle. */
  cinematic: [0.16, 1, 0.3, 1],
  /** Things moving on screen from A to B. */
  inOut: [0.77, 0, 0.175, 1],
  /** iOS sheet / drawer curve. */
  drawer: [0.32, 0.72, 0, 1],
} as const;

export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.28,
  slow: 0.56,
  cinematic: 0.9,
} as const;

export const spring = {
  /** Press feedback. */
  tap: { type: "spring", duration: 0.25, bounce: 0 },
  /** Menus, cards, small layout changes. */
  ui: { type: "spring", duration: 0.35, bounce: 0.08 },
  /** Shared-element / layout morphs (tab indicator, expanding cards). */
  layout: { type: "spring", duration: 0.5, bounce: 0.14 },
  /** Decorative, alive (orb, floating objects). */
  gentle: { type: "spring", duration: 0.9, bounce: 0.2 },
} as const;

/** Delay between siblings entering together. */
export const STAGGER = 0.04;

/** CSS equivalents for Tailwind arbitrary values / inline styles. */
export const cssEase = {
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
} as const;
