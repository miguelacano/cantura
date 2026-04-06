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
    Theme.stories.tsx   ← living reference: colors, typography, radius documented via Tailwind classes
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

Design tokens are defined once in `src/app/globals.css` inside a Tailwind v4 `@theme` block. Tailwind reads that block and automatically generates CSS custom properties and utility classes — no separate TypeScript token files are needed.

```
globals.css @theme
  --color-brand-primary: #3f2d1c
       ↓
Tailwind generates utility classes
  bg-brand-primary  /  text-brand-primary  /  border-brand-primary
       ↓
Used in component className
  <button className="bg-brand-primary text-text-inverse rounded-md">
```

All available tokens and their generated utility classes are documented in `src/design-system/Theme.stories.tsx`, which serves as the living reference for colors, typography scale, radius, and fonts. Open that story in Storybook to see every token and its corresponding Tailwind utility.

### Color utility class naming

| Group | Example utility classes |
|---|---|
| Brand | `bg-brand-primary`, `bg-brand-primary-hover`, `bg-brand-primary-subtle` |
| Surface | `bg-surface-light`, `bg-surface-dark`, `bg-surface-card`, `bg-surface-elevated` |
| Semantic | `bg-success-bg`, `text-success-text`, `bg-warning-bg`, `text-warning-text`, etc. |
| Text | `text-text-primary`, `text-text-muted`, `text-text-subtle`, `text-text-inverse` |
| Border | `border-border-default`, `border-border-strong`, `border-border-subtle` |
| Accent | `bg-accent-sand` |

### Typography scale (Tailwind class groups)

| Role | Classes |
|---|---|
| Display Large | `text-4xl font-extrabold tracking-tight` |
| Display Medium | `text-2xl font-bold tracking-tight` |
| Display Small | `text-xl font-bold tracking-tight` |
| Body Large | `text-base font-normal leading-relaxed` |
| Body Small | `text-sm font-normal leading-relaxed` |
| Label | `text-xs font-bold tracking-widest uppercase` |
| Caption | `text-xs font-medium tracking-normal` |

### Radius

| Token | Tailwind utility | Use |
|---|---|---|
| `--radius-sm` | `rounded-sm` | Chips, badges, tags |
| `--radius-md` | `rounded-md` | Inputs, buttons, cards |
| `--radius-lg` | `rounded-lg` | Modals, panels, sidebar |
| `--radius-full` | `rounded-full` | Avatars, toggles, pills |

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

## Theme Story

`src/design-system/Theme.stories.tsx` is the first entry in Storybook under **Design System / Theme**. Three focused stories:

1. **Colors** — every color group with CSS variable name, Tailwind utility class, and a live swatch
2. **Typography** — seven scale roles each showing the Tailwind class group and a live specimen
3. **Radius** — four steps with visual examples and use cases

---

## Non-Goals

- Publishing the component library as an npm package
- Chromatic or any cloud-based visual regression service
- Storybook deployed to a public URL (local + CI only for MVP)
- React Native / cross-platform components
