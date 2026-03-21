import type { Meta, StoryObj } from "@storybook/react";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { colors } from "./colors";
import { typography } from "./typography";

/**
 * # Theme Overview
 *
 * The Cantura theme is the totality of all design tokens working together —
 * colors, typography, radius, and spacing — expressed as Tailwind v4 CSS
 * custom properties registered in `globals.css`.
 *
 * ## How the token pipeline works
 *
 * ```
 * src/design-system/tokens/*.ts
 *         ↓  (kept in sync manually)
 * src/app/globals.css  (@theme block)
 *         ↓  (Tailwind v4 generates utilities from @theme)
 * Tailwind utilities  (bg-brand-primary, text-text-muted, rounded-md, …)
 *         ↓  (used in component className props)
 * React components
 * ```
 *
 * ## Token categories
 *
 * | Category | File | CSS prefix |
 * |---|---|---|
 * | Colors | `tokens/colors.ts` | `--color-*` |
 * | Typography | `tokens/typography.ts` | `--font-*` |
 * | Radius | `tokens/radius.ts` | `--radius-*` |
 * | Spacing | `tokens/spacing.ts` | Tailwind default scale |
 *
 * ## Border Radius
 *
 * Four radius steps cover every surface type:
 *
 * | Token | Value | Tailwind | Used on |
 * |---|---|---|---|
 * | `radius.sm` | 4px | `rounded-sm` | Chips, small badges, inline tags |
 * | `radius.md` | 8px | `rounded-md` | Inputs, buttons, standard cards |
 * | `radius.lg` | 12px | `rounded-lg` | Modals, prominent cards, sidebar panels |
 * | `radius.full` | 9999px | `rounded-full` | Avatars, toggles, pill badges |
 *
 * ## Spacing
 *
 * Cantura uses the Tailwind default spacing scale (1 unit = 4px).
 * Named spacing aliases document semantic intent — refer to them when
 * deciding which spacing value to use.
 *
 * ## How to add new tokens
 *
 * 1. Add the value to the relevant `tokens/*.ts` file with a JSDoc comment.
 * 2. Add the CSS custom property to the `@theme` block in `globals.css`.
 * 3. Verify it generates the expected Tailwind utility class.
 * 4. Update this story if needed.
 */

// ─── Border Radius ────────────────────────────────────────────────────────────

function RadiusBox({
  scale,
  value,
  tailwind,
  use,
}: {
  scale: string;
  value: string;
  tailwind: string;
  use: string;
}) {
  const pxValue = scale === "full" ? "9999px" : `${parseFloat(value) * 16}px`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          background: colors.brand.primary,
          borderRadius: value,
          flexShrink: 0,
        }}
      />
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: colors.text.primary,
            margin: "0 0 2px",
          }}
        >
          radius.{scale}
        </p>
        <p
          style={{ fontSize: 12, color: colors.text.muted, margin: "0 0 2px" }}
        >
          {value} ({pxValue})
        </p>
        <code
          style={{
            fontSize: 11,
            color: colors.brand.primary,
            background: colors.brand.primarySubtle,
            padding: "2px 6px",
            borderRadius: 4,
            display: "inline-block",
            marginBottom: 4,
          }}
        >
          {tailwind}
        </code>
        <p style={{ fontSize: 11, color: colors.text.subtle, margin: 0 }}>
          {use}
        </p>
      </div>
    </div>
  );
}

function RadiusSpecimen() {
  const items: { scale: keyof typeof radius; tailwind: string; use: string }[] =
    [
      {
        scale: "sm",
        tailwind: "rounded-sm",
        use: "Chips, small badges, inline tags",
      },
      {
        scale: "md",
        tailwind: "rounded-md",
        use: "Inputs, buttons, standard cards",
      },
      {
        scale: "lg",
        tailwind: "rounded-lg",
        use: "Modals, prominent cards, sidebar",
      },
      {
        scale: "full",
        tailwind: "rounded-full",
        use: "Avatars, toggles, pill badges",
      },
    ];

  return (
    <div
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
        padding: 32,
        maxWidth: 800,
        color: colors.text.primary,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Border Radius
      </h1>
      <p style={{ color: colors.text.muted, marginBottom: 32 }}>
        Four radius steps. Every component uses one of these — no custom values.
      </p>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {items.map(({ scale, tailwind, use }) => (
          <RadiusBox
            key={scale}
            scale={scale}
            value={radius[scale]}
            tailwind={tailwind}
            use={use}
          />
        ))}
      </div>

      {/* Applied examples */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 32,
          borderTop: `1px solid ${colors.border.default}`,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: colors.text.subtle,
            marginBottom: 16,
          }}
        >
          Applied to real surfaces
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Chip — sm */}
          <span
            style={{
              display: "inline-flex",
              padding: "4px 10px",
              background: colors.success.bg,
              color: colors.success.text,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: radius.sm,
            }}
          >
            On Track
          </span>

          {/* Button — md */}
          <button
            style={{
              display: "inline-flex",
              padding: "8px 16px",
              background: colors.brand.primary,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              borderRadius: radius.md,
              border: "none",
              cursor: "default",
            }}
          >
            Save Note
          </button>

          {/* Card — lg */}
          <div
            style={{
              padding: "12px 16px",
              background: colors.surface.card,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.lg,
              fontSize: 14,
              color: colors.text.primary,
            }}
          >
            Lesson Card
          </div>

          {/* Avatar — full */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.full,
              background: colors.brand.primary,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            MC
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Spacing ──────────────────────────────────────────────────────────────────

function SpacingSpecimen() {
  const items = Object.entries(spacing) as [keyof typeof spacing, string][];

  return (
    <div
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
        padding: 32,
        maxWidth: 700,
        color: colors.text.primary,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Spacing Scale
      </h1>
      <p style={{ color: colors.text.muted, marginBottom: 32 }}>
        Cantura uses the Tailwind default spacing scale (1 unit = 4px). These
        aliases document semantic intent for common values.
      </p>

      {items.map(([key, rem]) => {
        const px = parseFloat(rem) * 16;
        return (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "10px 0",
              borderBottom: `1px solid ${colors.border.subtle}`,
            }}
          >
            {/* Visual bar */}
            <div
              style={{
                height: 16,
                width: px,
                background: colors.brand.primary,
                borderRadius: 3,
                flexShrink: 0,
                maxWidth: 240,
              }}
            />
            <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
              <code
                style={{
                  fontSize: 12,
                  fontFamily: "monospace",
                  color: colors.brand.primary,
                  background: colors.brand.primarySubtle,
                  padding: "2px 6px",
                  borderRadius: 4,
                  minWidth: 60,
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {key}
              </code>
              <span style={{ fontSize: 13, color: colors.text.muted }}>
                {rem} · {px}px ·{" "}
                <code style={{ fontFamily: "monospace", fontSize: 12 }}>
                  p-{key} / gap-{key} / m-{key}
                </code>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Full theme overview ──────────────────────────────────────────────────────

function ThemeOverview() {
  return (
    <div
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
        padding: 32,
        maxWidth: 900,
        color: colors.text.primary,
        background: colors.surface.light,
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          marginBottom: 8,
        }}
      >
        Cantura Design System
      </h1>
      <p
        style={{
          fontSize: 16,
          color: colors.text.muted,
          marginBottom: 48,
          lineHeight: 1.625,
        }}
      >
        A token-driven system for building Cantura&apos;s music studio
        management UI. All tokens are defined in{" "}
        <code>src/design-system/tokens/</code> and registered as Tailwind v4 CSS
        custom properties.
      </p>

      {/* Color preview strip */}
      <section style={{ marginBottom: 48 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: colors.text.subtle,
            marginBottom: 16,
          }}
        >
          Color Tokens
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { hex: colors.brand.primary, label: "brand" },
            { hex: colors.surface.card, label: "surface" },
            { hex: colors.success.bg, label: "success" },
            { hex: colors.warning.bg, label: "warning" },
            { hex: colors.error.bg, label: "error" },
            { hex: colors.info.bg, label: "info" },
            { hex: colors.accent.sand, label: "accent" },
            { hex: colors.text.primary, label: "text" },
          ].map(({ hex, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: hex,
                  border: "1px solid rgba(0,0,0,0.08)",
                  marginBottom: 4,
                }}
              />
              <p style={{ fontSize: 10, color: colors.text.subtle, margin: 0 }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography preview */}
      <section style={{ marginBottom: 48 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: colors.text.subtle,
            marginBottom: 16,
          }}
        >
          Type Scale
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(
            Object.keys(typography.scale) as (keyof typeof typography.scale)[]
          ).map((role) => {
            const token = typography.scale[role];
            const sizeMap: Record<string, number> = {
              xs: 12,
              sm: 14,
              base: 16,
              xl: 20,
              "2xl": 24,
              "4xl": 36,
            };
            const weightMap: Record<string, number> = {
              regular: 400,
              medium: 500,
              bold: 700,
              extrabold: 800,
            };
            const trackMap: Record<string, string> = {
              tight: "-0.025em",
              widest: "0.1em",
              normal: "0",
            };
            return (
              <div
                key={role}
                style={{ display: "flex", alignItems: "baseline", gap: 16 }}
              >
                <span
                  style={{
                    fontFamily: '"Manrope", system-ui, sans-serif',
                    fontSize: sizeMap[token.size] ?? 16,
                    fontWeight: weightMap[token.weight] ?? 400,
                    letterSpacing:
                      "tracking" in token
                        ? (trackMap[token.tracking as string] ?? "0")
                        : "0",
                    textTransform: ("transform" in token
                      ? token.transform
                      : "none") as React.CSSProperties["textTransform"],
                    color: colors.text.primary,
                    lineHeight: 1,
                  }}
                >
                  Cantura
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: colors.text.subtle,
                    fontFamily: "monospace",
                  }}
                >
                  {role} · {token.size} / {token.weight}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radius preview */}
      <section style={{ marginBottom: 48 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: colors.text.subtle,
            marginBottom: 16,
          }}
        >
          Border Radius
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          {(Object.entries(radius) as [keyof typeof radius, string][]).map(
            ([key, val]) => (
              <div key={key} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: colors.brand.primary,
                    borderRadius: val,
                    marginBottom: 8,
                  }}
                />
                <p
                  style={{ fontSize: 11, color: colors.text.subtle, margin: 0 }}
                >
                  radius.{key}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Token pipeline explanation */}
      <section
        style={{
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.lg,
          padding: 24,
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          Token pipeline
        </p>
        <pre
          style={{
            fontSize: 12,
            color: colors.text.muted,
            lineHeight: 2,
            margin: 0,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {`tokens/colors.ts        → colors.brand.primary = "#3f2d1c"
        ↓
globals.css             → --color-brand-primary: #3f2d1c;  (inside @theme)
        ↓
Tailwind generates      → .bg-brand-primary { background: var(--color-brand-primary) }
        ↓
Component               → <button className="bg-brand-primary text-text-inverse" />`}
        </pre>
      </section>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "Design Tokens/Theme Overview",
  component: ThemeOverview,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete theme reference — how all token categories (colors, typography, radius, spacing) fit together and flow through the Tailwind v4 @theme pipeline.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Top-level overview of the Cantura design system — all token categories
 * summarised with the token pipeline diagram.
 */
export const Overview: Story = {};

/**
 * Border radius reference — the four radius steps with applied examples
 * showing chips, buttons, cards, and avatars.
 */
export const Radius: Story = {
  render: () => <RadiusSpecimen />,
};

/**
 * Spacing scale reference — Tailwind's default scale with semantic aliases
 * for the most common Cantura spacing values.
 */
export const Spacing: Story = {
  render: () => <SpacingSpecimen />,
};
