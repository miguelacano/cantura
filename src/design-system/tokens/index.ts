/**
 * Cantura Design Tokens — barrel export.
 *
 * Import tokens from here in component files and stories:
 *
 * ```ts
 * import { colors, typography, radius, spacing } from "@/design-system/tokens"
 * ```
 *
 * Token → Tailwind mapping lives in `src/app/globals.css` (@theme block).
 * Each CSS custom property follows the pattern:
 *   --color-brand-primary      → colors.brand.primary
 *   --radius-md                → radius.md
 *   --font-display             → typography.fontFamily.display
 */

export { colors } from "./colors";
export type { ColorToken } from "./colors";

export { typography } from "./typography";
export type { TypographyToken, ScaleRole } from "./typography";

export { radius } from "./radius";
export type { RadiusToken, RadiusScale } from "./radius";

export { spacing } from "./spacing";
export type { SpacingToken } from "./spacing";
