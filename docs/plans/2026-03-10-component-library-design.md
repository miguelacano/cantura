# Component Library & Storybook Design

**Date:** 2026-03-10
**Status:** Approved

---

## Decision: Single Repo, `src/design-system/` Layer

The component library is internal to Cantura only — no publishing, no external consumers. A monorepo would be over-engineering. Instead, `src/design-system/` acts as a first-class internal package that the rest of `src/` imports from. This makes design system thinking explicit and visible — a clear portfolio signal — without the tooling overhead of a monorepo.

---

## Folder Structure

```
src/
  design-system/
    tokens/
      colors.ts
      typography.ts
      radius.ts
      index.ts          ← re-exports all tokens, generates @theme input for globals.css
    atoms/
      Button/
        Button.tsx
        Button.stories.tsx
      Input/
      Textarea/
      Select/
      Toggle/
      Badge/
      Avatar/
      Icon/
      ProgressBar/
      Heading/
      Text/
      Label/
      Caption/
      Divider/
    molecules/
      FormField/
      SearchBar/
      NavItem/
      MessageBubble/
      NoteCard/
      StudentRow/
      LessonCard/
      AssignmentRow/
      ThreadPreview/
      ActivityItem/
      StatCard/
      MilestoneCard/
    organisms/
      AppHeader/
      AppSidebar/
      LessonGrid/
      ActivityFeed/
      PriorityStudentList/
      PracticeNoteThread/
      MessagingThread/
      AssignmentList/
      StudentHubHeader/
      StudentCard/
  app/               ← pages consume design-system components
  server/            ← services, db (unchanged)
```

---

## Token Layer

Tokens are TypeScript `as const` objects that feed into Tailwind v4's `@theme` block via `tokens/index.ts`. They are the single source of truth — Tailwind utilities, component classes, and Storybook docs all derive from the same values.

### `tokens/colors.ts`

```ts
export const colors = {
  // Brand
  primary:    "#3f2d1c",   // warm brown — main brand color
  bgLight:    "#f7f7f6",   // app surface (light mode)
  bgDark:     "#1d1915",   // app surface (dark mode)

  // Semantic — status and feedback
  success: {
    bg:   "#d1fae5",   // emerald-100  — "Completed", "On Track"
    text: "#047857",   // emerald-700
    bold: "#059669",   // emerald-600  — icons, progress fills
  },
  warning: {
    bg:   "#fef3c7",   // amber-100    — "In Progress", "Review Required"
    text: "#b45309",   // amber-700
    icon: "#f59e0b",   // amber-500    — star/highlight icons
  },
  error: {
    bg:   "#fee2e2",   // red-100      — "Late"
    text: "#b91c1c",   // red-700
  },
  info: {
    bg:   "#dbeafe",   // blue-100     — "Online" lesson mode
    text: "#1d40af",   // blue-700
  },

  // Accent
  sand:        "#fef3c7",   // amber-100 — "Accent Sand", highlights, callout backgrounds

  // Text
  textPrimary: "#0f172a",   // slate-900
  textMuted:   "#64748b",   // slate-500/600 range
  textSubtle:  "#94a3b8",   // slate-400 — timestamps, metadata
} as const
```

### `tokens/typography.ts`

```ts
export const typography = {
  fontFamily: {
    display: ["Manrope", "sans-serif"],
  },
  fontWeight: {
    light:     "300",
    regular:   "400",
    medium:    "500",
    semibold:  "600",
    bold:      "700",
    extrabold: "800",
  },
  // Named type roles — used by Heading, Text, Label, Caption atoms
  scale: {
    displayLg: { size: "4xl",  weight: "extrabold", tracking: "tight"         },  // 36px — page titles
    displayMd: { size: "2xl",  weight: "bold",      tracking: "tight"         },  // 24px — section headings
    displaySm: { size: "xl",   weight: "bold",      tracking: "tight"         },  // 20px — card titles
    bodyLg:    { size: "base", weight: "regular",   leading:  "relaxed"       },  // 16px — main body
    bodySm:    { size: "sm",   weight: "regular",   leading:  "relaxed"       },  // 14px — secondary text
    label:     { size: "xs",   weight: "bold",      tracking: "widest",
                 transform: "uppercase"                                        },  // ALL CAPS labels
    caption:   { size: "xs",   weight: "medium",    tracking: "normal"        },  // timestamps, metadata
  },
} as const
```

### `tokens/radius.ts`

```ts
export const radius = {
  sm:   "0.25rem",   // DEFAULT — tight elements (chips, small badges)
  md:   "0.5rem",    // lg — inputs, standard cards
  lg:   "0.75rem",   // xl — prominent cards, modals, sidebar
  full: "9999px",    // pills, avatars, toggle tracks
} as const
```

---

## Component Inventory

### Atoms

| Component | Variants / Notes |
|---|---|
| `Button` | `primary`, `secondary`, `outline`, `icon-only`; sizes `sm/md`; loading state |
| `Input` | text, email, password; optional leading icon; error state |
| `Textarea` | auto-resize; placeholder; focus ring |
| `Select` | with chevron icon; error state |
| `Toggle` | checked/unchecked; `primary` fill when on |
| `Badge` | `success`, `warning`, `error`, `info`, `neutral`; uppercase pill style |
| `Avatar` | image + fallback initials; sizes `sm/md/lg`; optional status dot |
| `Icon` | thin wrapper around Material Symbols Outlined; size + color props |
| `ProgressBar` | semantic color fills; optional percentage label |
| `Heading` | maps to `displayLg / displayMd / displaySm` scale roles |
| `Text` | maps to `bodyLg / bodySm` scale roles |
| `Label` | uppercase, tracking-widest — section labels, form labels |
| `Caption` | timestamps, metadata, muted secondary text |
| `Divider` | horizontal rule with optional centered text label |

### Molecules

| Component | Atoms Used | Notes |
|---|---|---|
| `FormField` | `Label` + input + `Caption` | Wraps input with label above, error/hint below |
| `SearchBar` | `Input` + `Icon` + `Button` | Optional filter button variant |
| `NavItem` | `Icon` + `Text` + `Badge` | Active, default, hover states; notification dot variant |
| `MessageBubble` | `Avatar` + `Text` + `Caption` | `sent` (primary bg) and `received` (white bg); read receipt |
| `NoteCard` | `Icon` + `Heading` + `Text` + `Button` | Teacher/guardian note with action footer |
| `StudentRow` | `Avatar` + `Text` + `Badge` | Compact list row — name, instrument, level, status |
| `LessonCard` | `Avatar` + `Heading` + `Caption` + `Badge` | Time, student, lesson mode (In Studio / Online) |
| `AssignmentRow` | `Text` + `Caption` + `Badge` | Numbered row with due date, status badge, chevron |
| `ThreadPreview` | `Avatar` + `Text` + `Caption` | Inbox list item — stacked avatars, preview text, unread dot |
| `ActivityItem` | `Icon` + `Text` + `Caption` | Single feed event — icon, description, relative timestamp |
| `StatCard` | `Label` + `Heading` + `Caption` | Dashboard metric tile with optional trend indicator |
| `MilestoneCard` | `Heading` + `ProgressBar` + `Label` | Upcoming recital/goal with % progress and target date |

### Organisms

| Component | Notes |
|---|---|
| `AppHeader` | Logo + search + notifications + user avatar — shared across all roles |
| `AppSidebar` | Role-aware nav items; teacher variant has "New Student" CTA |
| `LessonGrid` | Today's `LessonCard` items in responsive grid — teacher dashboard |
| `ActivityFeed` | Scrollable `ActivityItem` list + "Mark all read" + "View full history" |
| `PriorityStudentList` | Compact watchlist with "Manage Watchlist" action |
| `PracticeNoteThread` | Threaded notes (teacher + guardian) with reply input |
| `MessagingThread` | Full chat — `MessageBubble` list + date dividers + composer footer |
| `AssignmentList` | Filterable `AssignmentRow` list with Active / Completed tabs |
| `StudentHubHeader` | Student profile block + "Assign Piece" + "Add Note" CTAs |
| `StudentCard` | Full student summary — avatar, name, level, instrument, progress, latest note |

---

## Storybook Setup

**Version:** Storybook 8
**Builder:** Vite (not Webpack) — correct choice for Next.js 16 + Tailwind v4
**Visual testing:** `@storybook/test` play functions (no Chromatic)

### Configuration Files

```
.storybook/
  main.ts            — Vite builder, story globs pointing to src/design-system/**
  preview.ts         — imports globals.css, sets Manrope font decorator, dark mode toolbar toggle
  preview-head.html  — <link> tags for Manrope + Material Symbols Outlined from Google Fonts
```

### Story Organization

Stories mirror the `src/design-system/` folder structure. Storybook sidebar:

```
Design Tokens    ← tokens.stories.tsx
  Colors
  Typography
  Radius
Atoms
  Button
  Input
  Badge
  ...
Molecules
  FormField
  NoteCard
  ...
Organisms
  AppHeader
  PracticeNoteThread
  ...
```

### Story Format

All stories use CSF3 with `tags: ["autodocs"]` to auto-generate a props/API documentation page:

```ts
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: "Save Note", variant: "primary" } }
export const Secondary: Story = { args: { children: "Cancel", variant: "secondary" } }
export const Outline: Story = { args: { children: "Cancel", variant: "outline" } }
export const Loading: Story = { args: { children: "Saving…", variant: "primary", loading: true } }
```

### Visual Testing Strategy

**State coverage rule:** every component must have a story for each meaningful visual state. `Badge` needs one story per variant. `Input` needs default, focused, filled, and error stories. This makes every state reviewable on every PR without Chromatic.

**Play functions** handle interaction testing:

```ts
// Toggle — interaction test
export const TogglesOn: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("switch")
    expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    expect(toggle).toBeChecked()
  },
}

// FormField — validation test
export const ShowsEmailError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole("textbox"), "not-an-email")
    await userEvent.tab()
    expect(canvas.getByText(/invalid email/i)).toBeInTheDocument()
  },
}
```

### Scripts

```json
"storybook":      "storybook dev -p 6006",
"storybook:build": "storybook build",
"storybook:test":  "test-storybook"
```

`storybook:test` runs all play functions headlessly via `@storybook/test-runner` and is added to CI — play function failures block merges.

---

## Design Tokens Story Page

The "Design Tokens" entry is the first page in Storybook. It renders:

1. **Color palette** — brand swatches + each semantic group (success / warning / error / info / sand) displayed as a grid of labeled swatches with hex values and usage notes
2. **Typography specimen** — one row per scale role showing Manrope at the correct size, weight, and tracking with the role name and CSS values noted
3. **Border radius reference** — four boxes showing each radius value with a label

---

## Non-Goals

- Publishing the component library as an npm package
- Chromatic or any cloud-based visual regression service
- Storybook deployed to a public URL (local + CI only for MVP)
- React Native / cross-platform components
