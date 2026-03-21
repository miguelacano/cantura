import type { Meta, StoryObj } from "@storybook/react";
import { colors } from "./colors";

/**
 * # Color Tokens
 *
 * Cantura's color system is built on a small, intentional palette organised
 * into four groups:
 *
 * | Group | Purpose |
 * |---|---|
 * | **Brand** | Primary identity — warm brown CTAs, hover states, subtle tints |
 * | **Surface** | Canvas backgrounds — light/dark modes, card elevations |
 * | **Semantic** | Status feedback — success, warning, error, info |
 * | **Text / Border** | Typography and structural dividers |
 *
 * ## How to use
 *
 * Every token maps to a Tailwind v4 CSS custom property registered in
 * `globals.css`. Use the generated Tailwind utilities directly in className:
 *
 * ```tsx
 * // Background
 * <div className="bg-brand-primary" />
 * <div className="bg-success-bg" />
 *
 * // Text
 * <p className="text-text-muted" />
 * <span className="text-error-text" />
 *
 * // Border
 * <input className="border border-border-default focus:border-border-strong" />
 * ```
 *
 * ## Token naming pattern
 *
 * `--color-{group}-{variant}` in CSS / `{group}-{variant}` in Tailwind.
 *
 * For example `colors.brand.primary` → `var(--color-brand-primary)` → `bg-brand-primary`.
 *
 * ## Never hardcode hex values in components
 *
 * Always reference a token. If no existing token fits, extend `colors.ts` and
 * the `@theme` block in `globals.css` — do not create a one-off hex literal.
 */

// ─── Swatch helpers ───────────────────────────────────────────────────────────

function Swatch({
  label,
  hex,
  note,
  // dark = false,
}: {
  label: string;
  hex: string;
  note?: string;
  // dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1" style={{ minWidth: 120 }}>
      <div
        className="h-16 rounded-md border border-black/10 shadow-sm"
        style={{ backgroundColor: hex }}
        title={hex}
      />
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#0f172a",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{hex}</p>
      {note && (
        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{note}</p>
      )}
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#64748b",
          marginBottom: 16,
          paddingBottom: 8,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {children}
      </div>
    </section>
  );
}

// ─── Story component ──────────────────────────────────────────────────────────

function ColorPalette() {
  return (
    <div
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
        padding: 32,
        maxWidth: 900,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Color Tokens
      </h1>
      <p style={{ color: "#64748b", marginBottom: 32 }}>
        All colors in the Cantura design system. Use the Tailwind utility
        classes shown below — never hardcode hex values in components.
      </p>

      {/* Brand */}
      <Group title="Brand">
        <Swatch
          label="brand.primary"
          hex={colors.brand.primary}
          note="bg-brand-primary — main CTAs, active nav"
        />
        <Swatch
          label="brand.primaryHover"
          hex={colors.brand.primaryHover}
          note="bg-brand-primary-hover — hover states"
        />
        <Swatch
          label="brand.primarySubtle"
          hex={colors.brand.primarySubtle}
          note="bg-brand-primary-subtle — focus rings, tinted surfaces"
        />
      </Group>

      {/* Surface */}
      <Group title="Surface / Background">
        <Swatch
          label="surface.light"
          hex={colors.surface.light}
          note="bg-surface-light — light mode canvas"
        />
        <Swatch
          label="surface.card"
          hex={colors.surface.card}
          note="bg-surface-card — card / panel"
        />
        <Swatch
          label="surface.elevated"
          hex={colors.surface.elevated}
          note="bg-surface-elevated — hover rows, dropdowns"
        />
        <Swatch
          label="surface.dark"
          hex={colors.surface.dark}
          note="bg-surface-dark — dark mode canvas"
        />
      </Group>

      {/* Semantic — Success */}
      <Group title="Semantic — Success">
        <Swatch
          label="success.bg"
          hex={colors.success.bg}
          note="bg-success-bg — badge / chip backgrounds"
        />
        <Swatch
          label="success.text"
          hex={colors.success.text}
          note="text-success-text — on success.bg"
        />
        <Swatch
          label="success.bold"
          hex={colors.success.bold}
          note="text-success-bold — icon fills, progress"
        />
      </Group>

      {/* Semantic — Warning */}
      <Group title="Semantic — Warning">
        <Swatch
          label="warning.bg"
          hex={colors.warning.bg}
          note="bg-warning-bg — badge / chip backgrounds"
        />
        <Swatch
          label="warning.text"
          hex={colors.warning.text}
          note="text-warning-text — on warning.bg"
        />
        <Swatch
          label="warning.icon"
          hex={colors.warning.icon}
          note="text-warning-icon — star, flag icons"
        />
      </Group>

      {/* Semantic — Error */}
      <Group title="Semantic — Error">
        <Swatch
          label="error.bg"
          hex={colors.error.bg}
          note="bg-error-bg — validation backgrounds"
        />
        <Swatch
          label="error.text"
          hex={colors.error.text}
          note="text-error-text — on error.bg"
        />
      </Group>

      {/* Semantic — Info */}
      <Group title="Semantic — Info">
        <Swatch
          label="info.bg"
          hex={colors.info.bg}
          note="bg-info-bg — Online mode indicator"
        />
        <Swatch
          label="info.text"
          hex={colors.info.text}
          note="text-info-text — on info.bg"
        />
      </Group>

      {/* Accent */}
      <Group title="Accent">
        <Swatch
          label="accent.sand"
          hex={colors.accent.sand}
          note="bg-accent-sand — callout areas, starred items"
        />
      </Group>

      {/* Text */}
      <Group title="Text">
        <Swatch
          label="text.primary"
          hex={colors.text.primary}
          note="text-text-primary — headings, body"
        />
        <Swatch
          label="text.muted"
          hex={colors.text.muted}
          note="text-text-muted — secondary copy"
        />
        <Swatch
          label="text.subtle"
          hex={colors.text.subtle}
          note="text-text-subtle — timestamps, metadata"
        />
        <Swatch
          label="text.inverse"
          hex={colors.text.inverse}
          note="text-text-inverse — on dark/brand bg"
        />
      </Group>

      {/* Border */}
      <Group title="Border / Divider">
        <Swatch
          label="border.default"
          hex={colors.border.default}
          note="border-border-default — cards, inputs"
        />
        <Swatch
          label="border.strong"
          hex={colors.border.strong}
          note="border-border-strong — focused inputs"
        />
        <Swatch
          label="border.subtle"
          hex={colors.border.subtle}
          note="border-border-subtle — light separators"
        />
      </Group>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "Design Tokens/Colors",
  component: ColorPalette,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete color token reference for Cantura. Each swatch shows the token name, hex value, and corresponding Tailwind utility class.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The full color palette — brand, surface, semantic, text, and border tokens.
 * Use this page as the source of truth when choosing colors in components.
 */
export const Palette: Story = {};

/**
 * Brand colors in isolation — the primary warm-brown identity colors.
 * These appear on CTAs, active navigation items, and focus states.
 */
export const BrandColors: Story = {
  render: () => (
    <div
      style={{ fontFamily: '"Manrope", system-ui, sans-serif', padding: 32 }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
        Brand Colors
      </h2>
      <div style={{ display: "flex", gap: 16 }}>
        <Swatch
          label="brand.primary"
          hex={colors.brand.primary}
          note="Primary CTA, active nav"
        />
        <Swatch
          label="brand.primaryHover"
          hex={colors.brand.primaryHover}
          note="Hover state"
        />
        <Swatch
          label="brand.primarySubtle"
          hex={colors.brand.primarySubtle}
          note="Focus ring, tinted surface"
        />
      </div>
    </div>
  ),
};

/**
 * Semantic status colors — used in Badge, ProgressBar, and status indicators
 * to communicate lesson status, assignment state, and system feedback.
 */
export const SemanticColors: Story = {
  render: () => (
    <div
      style={{ fontFamily: '"Manrope", system-ui, sans-serif', padding: 32 }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
        Semantic Status Colors
      </h2>

      {(["success", "warning", "error", "info"] as const).map((group) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#64748b",
              marginBottom: 12,
            }}
          >
            {group}
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
            {Object.entries(colors[group]).map(([key, hex]) => (
              <div
                key={key}
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  backgroundColor: hex as string,
                  border: "1px solid rgba(0,0,0,0.08)",
                  minWidth: 120,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {group}.{key}
                </p>
                <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                  {hex as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Text color scale — primary, muted, and subtle establish a clear hierarchy
 * for headings, body content, and metadata respectively.
 */
export const TextScale: Story = {
  render: () => (
    <div
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
        padding: 32,
        background: colors.surface.light,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
        Text Color Scale
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: colors.text.primary,
            margin: 0,
          }}
        >
          text.primary — Mia Chen&apos;s Practice Notes
        </p>
        <p style={{ fontSize: 16, color: colors.text.muted, margin: 0 }}>
          text.muted — Secondary body copy, lesson descriptions, form hints
        </p>
        <p style={{ fontSize: 14, color: colors.text.subtle, margin: 0 }}>
          text.subtle — 2 hours ago · Read · Metadata
        </p>
        <div
          style={{
            background: colors.brand.primary,
            padding: "12px 16px",
            borderRadius: 8,
            display: "inline-block",
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.text.inverse,
              margin: 0,
            }}
          >
            text.inverse — on dark/brand backgrounds
          </p>
        </div>
      </div>
    </div>
  ),
};
