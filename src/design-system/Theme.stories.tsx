import type { Meta, StoryObj } from "@storybook/react";

/**
 * # Cantura Theme Reference
 *
 * Design tokens are defined once in `src/app/globals.css` inside a Tailwind v4
 * `@theme` block. Tailwind reads that block and automatically generates utility
 * classes — no separate TypeScript token files are needed.
 *
 * ```
 * globals.css @theme
 *   --color-brand-primary: #3f2d1c
 *        ↓
 * Tailwind generates utility classes
 *   bg-brand-primary  /  text-brand-primary  /  border-brand-primary
 *        ↓
 * Used in component className
 *   <button className="bg-brand-primary text-text-inverse rounded-md">
 * ```
 *
 * This story is the living reference for every token — what it is, what CSS
 * variable it maps to, and which Tailwind utility classes to use.
 */

// ─── Color groups ─────────────────────────────────────────────────────────────

const colorGroups = [
  {
    title: "Brand",
    description:
      "Primary identity — warm brown CTAs, hover states, subtle tints",
    swatches: [
      {
        name: "brand.primary",
        cssVar: "--color-brand-primary",
        utility: "bg-brand-primary",
        note: "CTAs, active nav, key interactive elements",
      },
      {
        name: "brand.primaryHover",
        cssVar: "--color-brand-primary-hover",
        utility: "bg-brand-primary-hover",
        note: "Hover state on primary elements",
      },
      {
        name: "brand.primarySubtle",
        cssVar: "--color-brand-primary-subtle",
        utility: "bg-brand-primary-subtle",
        note: "Focus rings, tinted backgrounds",
      },
    ],
  },
  {
    title: "Surface",
    description: "Page and component backgrounds",
    swatches: [
      {
        name: "surface.light",
        cssVar: "--color-surface-light",
        utility: "bg-surface-light",
        note: "Light mode page canvas",
      },
      {
        name: "surface.dark",
        cssVar: "--color-surface-dark",
        utility: "bg-surface-dark",
        note: "Dark mode page canvas",
      },
      {
        name: "surface.card",
        cssVar: "--color-surface-card",
        utility: "bg-surface-card",
        note: "Card and panel backgrounds",
      },
      {
        name: "surface.elevated",
        cssVar: "--color-surface-elevated",
        utility: "bg-surface-elevated",
        note: "Hover rows, dropdowns",
      },
    ],
  },
  {
    title: "Semantic — Success",
    description: "Completed, on track, positive states",
    swatches: [
      {
        name: "success.bg",
        cssVar: "--color-success-bg",
        utility: "bg-success-bg",
        note: "Badge and chip backgrounds",
      },
      {
        name: "success.text",
        cssVar: "--color-success-text",
        utility: "text-success-text",
        note: "Text on success.bg",
      },
      {
        name: "success.bold",
        cssVar: "--color-success-bold",
        utility: "text-success-bold",
        note: "Icon fills, progress bars",
      },
    ],
  },
  {
    title: "Semantic — Warning",
    description: "In progress, review required, caution states",
    swatches: [
      {
        name: "warning.bg",
        cssVar: "--color-warning-bg",
        utility: "bg-warning-bg",
        note: "Badge and chip backgrounds",
      },
      {
        name: "warning.text",
        cssVar: "--color-warning-text",
        utility: "text-warning-text",
        note: "Text on warning.bg",
      },
      {
        name: "warning.icon",
        cssVar: "--color-warning-icon",
        utility: "text-warning-icon",
        note: "Star and flag icons",
      },
    ],
  },
  {
    title: "Semantic — Error / Info",
    description: "Late, validation failures, and informational states",
    swatches: [
      {
        name: "error.bg",
        cssVar: "--color-error-bg",
        utility: "bg-error-bg",
        note: "Validation and late backgrounds",
      },
      {
        name: "error.text",
        cssVar: "--color-error-text",
        utility: "text-error-text",
        note: "Text on error.bg",
      },
      {
        name: "info.bg",
        cssVar: "--color-info-bg",
        utility: "bg-info-bg",
        note: "Online mode indicator",
      },
      {
        name: "info.text",
        cssVar: "--color-info-text",
        utility: "text-info-text",
        note: "Text on info.bg",
      },
    ],
  },
  {
    title: "Text",
    description: "Type hierarchy across all surfaces",
    swatches: [
      {
        name: "text.primary",
        cssVar: "--color-text-primary",
        utility: "text-text-primary",
        note: "Headings, key labels, body copy",
      },
      {
        name: "text.muted",
        cssVar: "--color-text-muted",
        utility: "text-text-muted",
        note: "Secondary copy, descriptions",
      },
      {
        name: "text.subtle",
        cssVar: "--color-text-subtle",
        utility: "text-text-subtle",
        note: "Timestamps, metadata, placeholders",
      },
      {
        name: "text.inverse",
        cssVar: "--color-text-inverse",
        utility: "text-text-inverse",
        note: "Text on dark or brand backgrounds",
      },
    ],
  },
  {
    title: "Border",
    description: "Dividers, input outlines, card edges",
    swatches: [
      {
        name: "border.default",
        cssVar: "--color-border-default",
        utility: "border-border-default",
        note: "Cards, inputs, dividers",
      },
      {
        name: "border.strong",
        cssVar: "--color-border-strong",
        utility: "border-border-strong",
        note: "Active inputs, selected states",
      },
      {
        name: "border.subtle",
        cssVar: "--color-border-subtle",
        utility: "border-border-subtle",
        note: "Very light separators",
      },
    ],
  },
  {
    title: "Accent",
    description: "Highlight and callout surfaces",
    swatches: [
      {
        name: "accent.sand",
        cssVar: "--color-accent-sand",
        utility: "bg-accent-sand",
        note: "Callout backgrounds, starred items",
      },
    ],
  },
] as const;

// ─── Type scale ───────────────────────────────────────────────────────────────

const typeScaleRows = [
  {
    label: "Display Large",
    classes: "text-4xl font-extrabold tracking-tight",
    use: "Hero headings, dashboard welcome",
    specimen: "Music shapes the soul.",
  },
  {
    label: "Display Medium",
    classes: "text-2xl font-bold tracking-tight",
    use: "Section headings, modal titles",
    specimen: "Today's Lessons",
  },
  {
    label: "Display Small",
    classes: "text-xl font-bold tracking-tight",
    use: "Card titles, panel headers",
    specimen: "Mia Chen — Piano",
  },
  {
    label: "Body Large",
    classes: "text-base font-normal leading-relaxed",
    use: "Main body copy, notes, descriptions",
    specimen: "Practice the first 8 bars with a metronome at ♩=80.",
  },
  {
    label: "Body Small",
    classes: "text-sm font-normal leading-relaxed",
    use: "Sidebar copy, hints, secondary text",
    specimen: "Next lesson on Thursday at 4:00 PM.",
  },
  {
    label: "Label",
    classes: "text-xs font-bold tracking-widest uppercase",
    use: "Form labels, section dividers, nav groups",
    specimen: "Instrument",
  },
  {
    label: "Caption",
    classes: "text-xs font-medium tracking-normal",
    use: "Timestamps, metadata, helper text",
    specimen: "Updated 2 hours ago · Read",
  },
] as const;

// ─── Radius scale ─────────────────────────────────────────────────────────────

const radiusScale = [
  {
    utility: "rounded-sm",
    cssVar: "--radius-sm",
    value: "0.25rem / 4px",
    use: "Chips, badges, inline tags",
  },
  {
    utility: "rounded-md",
    cssVar: "--radius-md",
    value: "0.5rem / 8px",
    use: "Inputs, buttons, standard cards",
  },
  {
    utility: "rounded-lg",
    cssVar: "--radius-lg",
    value: "0.75rem / 12px",
    use: "Modals, prominent cards, sidebar",
  },
  {
    utility: "rounded-full",
    cssVar: "--radius-full",
    value: "9999px",
    use: "Avatars, toggles, pill badges",
  },
] as const;

// ─── Components ───────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold tracking-widest uppercase text-text-subtle mb-6 pb-2 border-b border-border-default">
      {children}
    </h2>
  );
}

function Token({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs text-brand-primary bg-brand-primary-subtle px-1.5 py-0.5 rounded-sm font-mono">
      {children}
    </code>
  );
}

function ColorsSection() {
  return (
    <section className="mb-16">
      <SectionHeading>Colors</SectionHeading>
      <div className="flex flex-col gap-10">
        {colorGroups.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-bold tracking-widest uppercase text-text-muted mb-1">
              {group.title}
            </p>
            <p className="text-sm text-text-subtle mb-4">{group.description}</p>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              }}
            >
              {group.swatches.map((swatch) => (
                <div key={swatch.name} className="flex flex-col gap-2">
                  <div
                    className="h-12 rounded-md border border-black/10"
                    style={{ backgroundColor: `var(${swatch.cssVar})` }}
                  />
                  <p className="text-xs font-semibold text-text-primary">
                    {swatch.name}
                  </p>
                  <Token>{swatch.utility}</Token>
                  <p className="text-xs text-text-subtle">{swatch.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TypographySection() {
  return (
    <section className="mb-16">
      <SectionHeading>Type Scale</SectionHeading>
      <p className="text-sm text-text-muted mb-8">
        Each role is a named group of Tailwind utilities. Atom components apply
        these internally — use <Token>{"<Heading>"}</Token>,{" "}
        <Token>{"<Label>"}</Token>, <Token>{"<Caption>"}</Token> in application
        code rather than the class strings directly.
      </p>
      <div className="flex flex-col divide-y divide-border-default">
        {typeScaleRows.map((row, index) => (
          <div
            key={`row.label-${index}`}
            className="grid gap-6 py-5"
            style={{ gridTemplateColumns: "160px 1fr 240px" }}
          >
            {/* Role + classes */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold tracking-widest uppercase text-text-muted">
                {row.label}
              </p>
              <Token>{row.classes}</Token>
            </div>
            {/* Live specimen */}
            <p
              className={row.classes}
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {row.specimen}
            </p>
            {/* Use case */}
            <p className="text-xs text-text-subtle self-center">{row.use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RadiusSection() {
  return (
    <section className="mb-16">
      <SectionHeading>Border Radius</SectionHeading>
      <p className="text-sm text-text-muted mb-8">
        Four steps defined in <Token>@theme</Token> — every component uses one
        of these, no custom values.
      </p>
      <div className="flex gap-10 flex-wrap">
        {radiusScale.map((step) => (
          <div key={step.utility} className="flex flex-col gap-3">
            <div
              className="w-20 h-20 bg-brand-primary"
              style={{ borderRadius: `var(${step.cssVar})` }}
            />
            <Token>{step.utility}</Token>
            <p className="text-xs text-text-muted">{step.value}</p>
            <p className="text-xs text-text-subtle">{step.use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FontSection() {
  return (
    <section className="mb-16">
      <SectionHeading>Typography — Font</SectionHeading>
      <p className="text-sm text-text-muted mb-6">
        One typeface throughout the product, loaded from Google Fonts.
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-4">
          <Token>--font-display</Token>
          <span className="text-text-muted text-sm">→</span>
          <Token>font-display</Token>
          <span className="text-text-muted text-sm">
            Manrope 300–800 — all UI text
          </span>
        </div>
        <div className="flex items-baseline gap-4">
          <Token>--font-mono</Token>
          <span className="text-text-muted text-sm">→</span>
          <Token>font-mono</Token>
          <span className="text-text-muted text-sm">
            System monospace — code blocks only
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "Design System/Theme",
  component: ColorsSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Living reference for the Cantura theme — all tokens defined in globals.css @theme, and the Tailwind utility classes generated from them.",
      },
    },
  },
} satisfies Meta<typeof ColorsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Color tokens — all groups with their CSS variables and utility classes. */
export const Colors: Story = {
  render: () => (
    <div
      className="bg-surface-light p-10"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <ColorsSection />
    </div>
  ),
};

/** Type scale and font tokens — the seven named roles and their Tailwind class groups. */
export const Typography: Story = {
  render: () => (
    <div
      className="bg-surface-light p-10"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <FontSection />
      <TypographySection />
    </div>
  ),
};

/** Border radius — four steps with visual examples and use cases. */
export const Radius: Story = {
  render: () => (
    <div
      className="bg-surface-light p-10"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <RadiusSection />
    </div>
  ),
};
