import type { Meta, StoryObj } from "@storybook/react";
import { typography } from "./typography";
import { colors } from "./colors";

/**
 * # Typography Tokens
 *
 * Cantura uses **Manrope** as its sole UI typeface — a geometric sans-serif
 * with a variable weight axis (300–800). It is loaded from Google Fonts and
 * defined in the `--font-display` CSS custom property.
 *
 * ## Type scale roles
 *
 * The scale has seven named roles. Each role maps to an atom component:
 *
 * | Role | Atom | Size | Use |
 * |---|---|---|---|
 * | `displayLg` | `<Heading level="lg">` | 36px / extrabold | Hero titles, welcome headings |
 * | `displayMd` | `<Heading level="md">` | 24px / bold | Section headings, modal titles |
 * | `displaySm` | `<Heading level="sm">` | 20px / bold | Card titles, panel headers |
 * | `bodyLg` | `<Text size="lg">` | 16px / regular | Main body copy, notes |
 * | `bodySm` | `<Text size="sm">` | 14px / regular | Sidebar copy, form hints |
 * | `label` | `<Label>` | 12px / bold / UPPERCASE | Form labels, section dividers, nav groups |
 * | `caption` | `<Caption>` | 12px / medium | Timestamps, metadata, helper text |
 *
 * ## Font weight usage
 *
 * | Weight | Value | Typical use |
 * |---|---|---|
 * | Light | 300 | Decorative large numerics only |
 * | Regular | 400 | Body copy |
 * | Medium | 500 | Captions, secondary labels |
 * | Semibold | 600 | Nav items, badge text |
 * | Bold | 700 | Section headings, card titles |
 * | Extrabold | 800 | Hero/display headings |
 *
 * ## How to use
 *
 * Use the atom components (`Heading`, `Text`, `Label`, `Caption`) rather than
 * applying raw Tailwind classes. This keeps the scale consistent:
 *
 * ```tsx
 * import { Heading, Text, Label, Caption } from "@/design-system/atoms"
 *
 * <Heading level="md">Today's Lessons</Heading>
 * <Text size="lg">Practice the first 8 bars with a metronome at ♩=80.</Text>
 * <Label>Instrument</Label>
 * <Caption>Added 2 hours ago</Caption>
 * ```
 *
 * When building new atoms or molecules, refer to `typography.scale` directly
 * for the Tailwind size/weight/tracking values:
 *
 * ```ts
 * import { typography } from "@/design-system/tokens"
 * const { size, weight, tracking } = typography.scale.displayMd
 * // size → "2xl", weight → "bold", tracking → "tight"
 * ```
 */

// ─── Specimen helpers ─────────────────────────────────────────────────────────

type ScaleKey = keyof typeof typography.scale;

const scaleData: {
  role: ScaleKey;
  label: string;
  specimen: string;
  description: string;
}[] = [
  {
    role: "displayLg",
    label: "Display Large",
    specimen: "Music shapes the soul.",
    description:
      "36px · extrabold · tight tracking — hero headings, dashboard welcome",
  },
  {
    role: "displayMd",
    label: "Display Medium",
    specimen: "Today's Lessons",
    description:
      "24px · bold · tight tracking — section headings, modal titles",
  },
  {
    role: "displaySm",
    label: "Display Small",
    specimen: "Mia Chen — Piano",
    description: "20px · bold · tight tracking — card titles, panel headers",
  },
  {
    role: "bodyLg",
    label: "Body Large",
    specimen:
      "Practice the first 8 bars with a metronome at ♩=80. Focus on even finger weight in the left hand.",
    description:
      "16px · regular · relaxed leading — main body copy, note content",
  },
  {
    role: "bodySm",
    label: "Body Small",
    specimen: "Next lesson on Thursday at 4:00 PM. Bring your practice log.",
    description:
      "14px · regular · relaxed leading — secondary text, sidebar, form hints",
  },
  {
    role: "label",
    label: "Label",
    specimen: "Instrument",
    description:
      "12px · bold · widest tracking · UPPERCASE — form labels, section dividers",
  },
  {
    role: "caption",
    label: "Caption",
    specimen: "Updated 2 hours ago · Read",
    description:
      "12px · medium · normal tracking — timestamps, metadata, helper text",
  },
];

function weightToNumber(w: string): number {
  const map: Record<string, number> = {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  };
  return map[w] ?? 400;
}

function sizeToPixels(size: string): number {
  const map: Record<string, number> = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  };
  return map[size] ?? 16;
}

function trackingToEm(tracking: string): string {
  const map: Record<string, string> = {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  };
  return map[tracking] ?? "0";
}

function ScaleRow({ role }: { role: ScaleKey }) {
  const token = typography.scale[role];
  const fontSize = sizeToPixels(token.size);
  const fontWeight = weightToNumber(token.weight);
  const letterSpacing =
    "tracking" in token ? trackingToEm(token.tracking as string) : "0";
  const lineHeight =
    "leading" in token ? (token.leading === "relaxed" ? 1.625 : 1.5) : 1.2;
  const textTransform =
    "transform" in token ? (token.transform as string) : "none";
  const data = scaleData.find((d) => d.role === role)!;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr 220px",
        gap: 24,
        alignItems: "center",
        padding: "20px 0",
        borderBottom: `1px solid ${colors.border.default}`,
      }}
    >
      {/* Meta column */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: colors.text.muted,
            margin: "0 0 4px",
          }}
        >
          {data.label}
        </p>
        <code
          style={{
            fontSize: 11,
            color: colors.brand.primary,
            background: colors.brand.primarySubtle,
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          typography.scale.{role}
        </code>
      </div>

      {/* Specimen column */}
      <p
        style={{
          fontFamily: '"Manrope", system-ui, sans-serif',
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight,
          textTransform: textTransform as React.CSSProperties["textTransform"],
          color: colors.text.primary,
          margin: 0,
        }}
      >
        {data.specimen}
      </p>

      {/* Details column */}
      <div>
        <p
          style={{
            fontSize: 11,
            color: colors.text.subtle,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {data.description}
        </p>
        <p
          style={{
            fontSize: 11,
            color: colors.text.subtle,
            margin: "4px 0 0",
            fontFamily: "monospace",
          }}
        >
          text-{token.size} · font-{token.weight}
          {"tracking" in token ? ` · tracking-${token.tracking}` : ""}
          {"leading" in token ? ` · leading-${token.leading}` : ""}
        </p>
      </div>
    </div>
  );
}

// ─── Story components ─────────────────────────────────────────────────────────

function TypeScaleSpecimen() {
  return (
    <div
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
        padding: 32,
        maxWidth: 960,
        color: colors.text.primary,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Typography Tokens
      </h1>
      <p style={{ color: colors.text.muted, marginBottom: 8 }}>
        Cantura uses Manrope (300–800) as its sole UI typeface. Seven named
        roles cover every text use-case in the product.
      </p>
      <p style={{ color: colors.text.subtle, fontSize: 13, marginBottom: 32 }}>
        Columns: <strong>token role</strong> · <strong>live specimen</strong> ·{" "}
        <strong>Tailwind utilities + description</strong>
      </p>

      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 220px",
          gap: 24,
          padding: "8px 0 12px",
          borderBottom: `2px solid ${colors.border.default}`,
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: colors.text.subtle,
        }}
      >
        <span>Role</span>
        <span>Specimen</span>
        <span>Details</span>
      </div>

      {(Object.keys(typography.scale) as ScaleKey[]).map((role) => (
        <ScaleRow key={role} role={role} />
      ))}
    </div>
  );
}

function FontWeightSpecimen() {
  const weights = [
    {
      key: "light",
      value: 300,
      label: "Light 300",
      use: "Decorative large numerics only",
    },
    {
      key: "regular",
      value: 400,
      label: "Regular 400",
      use: "Body copy — notes, descriptions",
    },
    {
      key: "medium",
      value: 500,
      label: "Medium 500",
      use: "Captions, secondary labels, timestamps",
    },
    {
      key: "semibold",
      value: 600,
      label: "Semibold 600",
      use: "Nav items, badge text, form values",
    },
    {
      key: "bold",
      value: 700,
      label: "Bold 700",
      use: "Card titles, section headings, CTA labels",
    },
    {
      key: "extrabold",
      value: 800,
      label: "Extrabold 800",
      use: "Hero/display headings, dashboard welcome",
    },
  ];

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
        Font Weights
      </h1>
      <p style={{ color: colors.text.muted, marginBottom: 32 }}>
        Manrope&apos;s variable weight axis gives us six steps. Use the named
        keys — not raw numbers — in component className strings.
      </p>

      {weights.map(({ key, value, label, use }) => (
        <div
          key={key}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 24,
            padding: "16px 0",
            borderBottom: `1px solid ${colors.border.default}`,
          }}
        >
          <span
            style={{
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontSize: 28,
              fontWeight: value,
              color: colors.text.primary,
              minWidth: 300,
            }}
          >
            {label}
          </span>
          <div>
            <code
              style={{
                fontSize: 11,
                color: colors.brand.primary,
                background: colors.brand.primarySubtle,
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              font-{key}
            </code>
            <p
              style={{
                fontSize: 12,
                color: colors.text.subtle,
                margin: "4px 0 0",
              }}
            >
              {use}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographyInContext() {
  return (
    <div
      style={{
        fontFamily: '"Manrope", system-ui, sans-serif',
        padding: 32,
        maxWidth: 600,
        background: colors.surface.light,
        color: colors.text.primary,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Typography In Context
      </h1>
      <p style={{ color: colors.text.muted, marginBottom: 32 }}>
        Realistic usage examples — how the scale roles work together.
      </p>

      {/* Lesson card example */}
      <div
        style={{
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            color: colors.text.subtle,
            margin: "0 0 8px",
          }}
        >
          {/* Label role */}
          Today · 4:00 PM
        </p>
        <p
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: colors.text.primary,
            margin: "0 0 4px",
          }}
        >
          {/* displaySm role */}
          Mia Chen
        </p>
        <p
          style={{ fontSize: 16, color: colors.text.muted, margin: "0 0 12px" }}
        >
          {/* bodyLg role */}
          Piano · Grade 5 · In Studio
        </p>
        <p style={{ fontSize: 12, color: colors.text.subtle, margin: 0 }}>
          {/* caption role */}
          Last practice note: 2 days ago
        </p>
      </div>

      {/* Note card example */}
      <div
        style={{
          background: colors.accent.sand,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 8,
          padding: 16,
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            color: colors.warning.text,
            margin: "0 0 8px",
          }}
        >
          Practice Note
        </p>
        <p
          style={{
            fontSize: 16,
            color: colors.text.primary,
            lineHeight: 1.625,
            margin: "0 0 8px",
          }}
        >
          Focus on the left-hand passage in bars 12–16. Use the metronome at
          ♩=72 and increase by 4 bpm each day until ♩=92.
        </p>
        <p style={{ fontSize: 12, color: colors.text.subtle, margin: 0 }}>
          Ms. Navarro · Added 3 hours ago
        </p>
      </div>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "Design Tokens/Typography",
  component: TypeScaleSpecimen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Typography token reference for Cantura. All type decisions should use one of the seven named scale roles rather than raw Tailwind size/weight classes.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TypeScaleSpecimen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The complete type scale — all seven roles shown as live specimens with
 * their Tailwind utility equivalents.
 */
export const TypeScale: Story = {};

/**
 * Manrope's six weight steps with usage guidance for each.
 * Always reference the token key name (`font-bold`) rather than the
 * numeric weight to keep components decoupled from the font's raw values.
 */
export const FontWeights: Story = {
  render: () => <FontWeightSpecimen />,
};

/**
 * Real-world composition examples showing how the scale roles work
 * together inside a LessonCard and a NoteCard context.
 */
export const InContext: Story = {
  render: () => <TypographyInContext />,
};
