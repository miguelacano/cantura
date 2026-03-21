/**
 * Cantura spacing tokens.
 *
 * These map to the Tailwind v4 default spacing scale (1 unit = 4px).
 * The named aliases here document the intended semantic use of specific
 * spacing values across the design system — they do NOT introduce custom
 * Tailwind utilities; use standard Tailwind classes (p-4, gap-6, etc.).
 *
 * Reference only — use in component documentation and Storybook stories.
 */

export const spacing = {
  /** 4px (1) — icon padding, tight inline gaps */
  "1": "0.25rem",
  /** 8px (2) — compact padding inside chips, badges */
  "2": "0.5rem",
  /** 12px (3) — small element padding (sm Button) */
  "3": "0.75rem",
  /** 16px (4) — standard element padding (md Button, Input), base grid unit */
  "4": "1rem",
  /** 20px (5) — card inner padding */
  "5": "1.25rem",
  /** 24px (6) — section spacing, card gaps */
  "6": "1.5rem",
  /** 32px (8) — larger section gaps, panel padding */
  "8": "2rem",
  /** 40px (10) — modal padding, page section rhythm */
  "10": "2.5rem",
  /** 48px (12) — page-level vertical rhythm */
  "12": "3rem",
  /** 64px (16) — layout gaps, sidebar width components */
  "16": "4rem",
} as const;

export type SpacingToken = typeof spacing;
