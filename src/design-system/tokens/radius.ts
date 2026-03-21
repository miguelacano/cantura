/**
 * Cantura border-radius tokens.
 *
 * Used by all components that render rounded corners. The values map to
 * Tailwind v4 `@theme --radius-*` CSS custom properties in globals.css.
 *
 * Radius decisions by component type:
 *  - `sm`   → chips, small badges, inline tags
 *  - `md`   → inputs, textareas, selects, standard cards, buttons
 *  - `lg`   → prominent cards, modals, sidebar panels, drawers
 *  - `full` → avatar images, toggle tracks, pill badges, FABs
 */

export const radius = {
  /** 4px — tight elements: chips, small badges, inline tags */
  sm: "0.25rem",
  /** 8px — standard elements: inputs, buttons, cards */
  md: "0.5rem",
  /** 12px — prominent containers: modals, large cards, sidebar */
  lg: "0.75rem",
  /** 9999px — perfect circles / pills: avatars, toggles, pill badges */
  full: "9999px",
} as const;

export type RadiusToken = typeof radius;
export type RadiusScale = keyof typeof radius;
