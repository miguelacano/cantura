/**
 * Cantura typography tokens — single source of truth for all type decisions.
 *
 * Feeds into:
 *  1. Tailwind v4 `@theme` block in globals.css
 *  2. Typography atom components (Heading, Text, Label, Caption)
 *  3. Storybook typography documentation
 *
 * Font stack:
 *  - Display/UI: Manrope (Google Fonts, variable weight 300–800)
 *  - Fallback: system-ui → sans-serif
 *
 * Scale roles map directly to the Heading / Text / Label / Caption atoms.
 * Do NOT invent new roles — extend an existing role's props instead.
 */

export const typography = {
  // ─── Font Families ───────────────────────────────────────────────────────
  fontFamily: {
    /** Primary display/UI font — used everywhere in Cantura */
    display: ["Manrope", "system-ui", "sans-serif"],
    /** Monospace — code blocks, debug views only */
    mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  },

  // ─── Font Weights ────────────────────────────────────────────────────────
  fontWeight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // ─── Type Scale ──────────────────────────────────────────────────────────
  /**
   * Named roles used by Heading, Text, Label, Caption atoms.
   *
   * Each role maps to:
   *  - `size`     → Tailwind font-size utility (e.g. "4xl" → text-4xl → 36px)
   *  - `weight`   → key of fontWeight above
   *  - `leading`  → Tailwind line-height utility (optional)
   *  - `tracking` → Tailwind letter-spacing utility (optional)
   *  - `transform`→ CSS text-transform (optional)
   *
   * Pixel equivalents assume Tailwind v4 defaults (1rem = 16px).
   */
  scale: {
    /**
     * Display Large — 36px / extrabold / tight tracking
     * Use: hero headings, major page titles (e.g. dashboard welcome)
     */
    displayLg: {
      size: "4xl",
      weight: "extrabold",
      tracking: "tight",
      px: 36,
    },

    /**
     * Display Medium — 24px / bold / tight tracking
     * Use: section headings, modal titles, card group headers
     */
    displayMd: {
      size: "2xl",
      weight: "bold",
      tracking: "tight",
      px: 24,
    },

    /**
     * Display Small — 20px / bold / tight tracking
     * Use: card titles, panel headings, list section headers
     */
    displaySm: {
      size: "xl",
      weight: "bold",
      tracking: "tight",
      px: 20,
    },

    /**
     * Body Large — 16px / regular / relaxed leading
     * Use: main body copy, note content, lesson descriptions
     */
    bodyLg: {
      size: "base",
      weight: "regular",
      leading: "relaxed",
      px: 16,
    },

    /**
     * Body Small — 14px / regular / relaxed leading
     * Use: secondary text, sidebar descriptions, form hints
     */
    bodySm: {
      size: "sm",
      weight: "regular",
      leading: "relaxed",
      px: 14,
    },

    /**
     * Label — 12px / bold / widest tracking / UPPERCASE
     * Use: form labels, section dividers, status chip text, nav group headers
     */
    label: {
      size: "xs",
      weight: "bold",
      tracking: "widest",
      transform: "uppercase" as const,
      px: 12,
    },

    /**
     * Caption — 12px / medium / normal tracking
     * Use: timestamps, metadata, helper text, avatar initials, read receipts
     */
    caption: {
      size: "xs",
      weight: "medium",
      tracking: "normal",
      px: 12,
    },
  },
} as const;

export type TypographyToken = typeof typography;
export type ScaleRole = keyof typeof typography.scale;
