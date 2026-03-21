/**
 * Cantura color tokens — single source of truth for all color decisions.
 *
 * These values feed into:
 *  1. Tailwind v4 `@theme` block in globals.css (CSS custom properties)
 *  2. Component classes via Tailwind utilities (e.g. `bg-brand-primary`)
 *  3. Storybook design token documentation
 *
 * Naming convention:
 *  - Brand colors: `brand.*`
 *  - Semantic/status: `semantic.*` (success / warning / error / info)
 *  - Surface/background: `surface.*`
 *  - Text: `text.*`
 *  - Accent/highlight: `accent.*`
 *  - Border: `border.*`
 */

export const colors = {
  // ─── Brand ───────────────────────────────────────────────────────────────
  brand: {
    /** Primary warm brown — main CTAs, active nav, key interactive elements */
    primary: "#3f2d1c",
    /** Lighter warm brown — hover states on primary */
    primaryHover: "#5a4130",
    /** Lightest warm brown — subtle tinted surfaces, focus rings */
    primarySubtle: "#f5ede6",
  },

  // ─── Surface / Background ────────────────────────────────────────────────
  surface: {
    /** App canvas — light mode page background */
    light: "#f7f7f6",
    /** App canvas — dark mode page background */
    dark: "#1d1915",
    /** Card / panel surface over light canvas */
    card: "#ffffff",
    /** Slightly elevated surface — hover rows, dropdowns */
    elevated: "#f1f0ef",
  },

  // ─── Semantic ────────────────────────────────────────────────────────────
  success: {
    /** Success background — "Completed", "On Track" badges */
    bg: "#d1fae5",
    /** Success text — readable on success.bg */
    text: "#047857",
    /** Success icon / progress fill */
    bold: "#059669",
  },
  warning: {
    /** Warning background — "In Progress", "Review Required" */
    bg: "#fef3c7",
    /** Warning text — readable on warning.bg */
    text: "#b45309",
    /** Warning icon — star, flag highlights */
    icon: "#f59e0b",
  },
  error: {
    /** Error background — "Late", form validation */
    bg: "#fee2e2",
    /** Error text — readable on error.bg */
    text: "#b91c1c",
  },
  info: {
    /** Info background — "Online" lesson mode indicator */
    bg: "#dbeafe",
    /** Info text — readable on info.bg */
    text: "#1d40af",
  },

  // ─── Accent ──────────────────────────────────────────────────────────────
  accent: {
    /** Sand — callout backgrounds, highlighted note areas, "starred" items */
    sand: "#fef3c7",
  },

  // ─── Text ────────────────────────────────────────────────────────────────
  text: {
    /** Primary text — headings, key labels, body copy */
    primary: "#0f172a",
    /** Muted text — secondary body copy, descriptions */
    muted: "#64748b",
    /** Subtle text — timestamps, metadata, placeholder copy */
    subtle: "#94a3b8",
    /** Inverse text — text on dark/primary backgrounds */
    inverse: "#ffffff",
  },

  // ─── Border / Divider ────────────────────────────────────────────────────
  border: {
    /** Default border — cards, inputs, dividers */
    default: "#e2e8f0",
    /** Strong border — active inputs, selected states */
    strong: "#94a3b8",
    /** Subtle border — very light separators */
    subtle: "#f1f5f9",
  },
} as const;

/** Flat map of CSS variable name → hex value for @theme injection */
export type ColorToken = typeof colors;
