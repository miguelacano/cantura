# Component Library & Storybook Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Cantura's design system in `src/design-system/` with a token layer, atomic component hierarchy, and Storybook 8 for development, documentation, and visual testing.

**Architecture:** `src/design-system/` is a first-class internal layer (tokens → atoms → molecules → organisms). Token files feed into Tailwind v4's `@theme` block. Stories are co-located with components using CSF3 + autodocs + `@storybook/test` play functions for interaction testing.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, Storybook 8 (`@storybook/nextjs-vite`), `@storybook/test`, `@storybook/test-runner`, Material Symbols Outlined (Google Fonts), Manrope (Google Fonts)

**Reference:** `docs/plans/2026-03-10-component-library-design.md`

---

## Phase 1: Storybook Infrastructure

### Task 1: Install Storybook and dependencies

**Files:**
- Modify: `package.json`
- Create: `.storybook/main.ts`

**Step 1: Install packages**

```bash
pnpm add -D \
  @storybook/nextjs-vite \
  @storybook/addon-essentials \
  @storybook/addon-a11y \
  @storybook/addon-themes \
  @storybook/test \
  @storybook/test-runner \
  @tailwindcss/vite \
  @testing-library/user-event \
  storybook
```

**Step 2: Create `.storybook/main.ts`**

```ts
import type { StorybookConfig } from "@storybook/nextjs-vite"
import tailwindcss from "@tailwindcss/vite"

const config: StorybookConfig = {
  stories: ["../src/design-system/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    return config
  },
}

export default config
```

**Step 3: Add scripts to `package.json`**

```json
"storybook":       "storybook dev -p 6006",
"storybook:build": "storybook build",
"storybook:test":  "test-storybook"
```

**Step 4: Install Playwright for test-runner**

```bash
pnpm exec playwright install chromium
```

**Step 5: Verify Storybook starts**

```bash
pnpm storybook
```
Expected: Storybook opens at `http://localhost:6006` with empty stories.

**Step 6: Commit**

```bash
git add .storybook/main.ts package.json pnpm-lock.yaml
git commit -m "chore: install Storybook 8 with nextjs-vite and test runner"
```

---

### Task 2: Configure Storybook preview (fonts, globals, dark mode)

**Files:**
- Create: `.storybook/preview.ts`
- Create: `.storybook/preview-head.html`

**Step 1: Create `.storybook/preview-head.html`**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
  rel="stylesheet"
/>
```

**Step 2: Create `.storybook/preview.ts`**

```ts
import type { Preview } from "@storybook/react"
import "../src/app/globals.css"

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },  // we use the themes addon instead
    layout: "centered",
  },
  globalTypes: {
    theme: {
      name: "Theme",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark",  title: "Dark",  icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light"
      return (
        <div className={theme} style={{ fontFamily: "Manrope, sans-serif" }}>
          <div className="bg-background-light dark:bg-background-dark min-h-16 p-6">
            <Story />
          </div>
        </div>
      )
    },
  ],
}

export default preview
```

**Step 3: Verify dark mode toggle works**

```bash
pnpm storybook
```
Expected: Toolbar shows sun/moon toggle. Toggling changes the background between `#f7f7f6` and `#1d1915`.

**Step 4: Commit**

```bash
git add .storybook/preview.ts .storybook/preview-head.html
git commit -m "chore: configure Storybook preview with fonts and dark mode toggle"
```

---

## Phase 2: Token Layer ✓ COMPLETE

> **Status:** Done. Approach changed from the original plan.
>
> TypeScript token files were evaluated and removed. `src/app/globals.css` `@theme` block is the single source of truth for all design tokens. Tailwind generates utility classes from it automatically.
>
> `src/design-system/Theme.stories.tsx` is the living reference — three stories (Colors, Typography, Radius) documenting every token and its Tailwind utility class.
>
> See `docs/plans/2026-03-10-component-library-design.md` → Token Layer for the full utility class reference.

### ~~Task 3: Create design tokens~~ ✓

**Files:**
- ~~Create: `src/design-system/tokens/colors.ts`~~
- ~~Create: `src/design-system/tokens/typography.ts`~~
- ~~Create: `src/design-system/tokens/radius.ts`~~
- ~~Create: `src/design-system/tokens/index.ts`~~
- Done: `src/app/globals.css` — `@theme` block defines all tokens

**Step 1: Create `src/design-system/tokens/colors.ts`**

```ts
export const colors = {
  primary:    "#3f2d1c",
  bgLight:    "#f7f7f6",
  bgDark:     "#1d1915",

  success: {
    bg:   "#d1fae5",   // emerald-100
    text: "#047857",   // emerald-700
    bold: "#059669",   // emerald-600
  },
  warning: {
    bg:   "#fef3c7",   // amber-100
    text: "#b45309",   // amber-700
    icon: "#f59e0b",   // amber-500
  },
  error: {
    bg:   "#fee2e2",   // red-100
    text: "#b91c1c",   // red-700
  },
  info: {
    bg:   "#dbeafe",   // blue-100
    text: "#1d40af",   // blue-700
  },
  sand:        "#fef3c7",   // accent — amber-100

  textPrimary: "#0f172a",   // slate-900
  textMuted:   "#64748b",   // slate-500
  textSubtle:  "#94a3b8",   // slate-400
} as const
```

**Step 2: Create `src/design-system/tokens/typography.ts`**

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
  scale: {
    displayLg: { size: "text-4xl",  weight: "font-extrabold", tracking: "tracking-tight"  },
    displayMd: { size: "text-2xl",  weight: "font-bold",      tracking: "tracking-tight"  },
    displaySm: { size: "text-xl",   weight: "font-bold",      tracking: "tracking-tight"  },
    bodyLg:    { size: "text-base", weight: "font-normal",    leading:  "leading-relaxed" },
    bodySm:    { size: "text-sm",   weight: "font-normal",    leading:  "leading-relaxed" },
    label:     { size: "text-xs",   weight: "font-bold",      tracking: "tracking-widest",
                 transform: "uppercase"                                                     },
    caption:   { size: "text-xs",   weight: "font-medium",   tracking: "tracking-normal"  },
  },
} as const
```

**Step 3: Create `src/design-system/tokens/radius.ts`**

```ts
export const radius = {
  sm:   "rounded",        // 0.25rem — tight elements
  md:   "rounded-lg",     // 0.5rem  — inputs, standard cards
  lg:   "rounded-xl",     // 0.75rem — prominent cards
  full: "rounded-full",   // 9999px  — pills, avatars, toggles
} as const
```

**Step 4: Create `src/design-system/tokens/index.ts`**

```ts
export { colors } from "./colors"
export { typography } from "./typography"
export { radius } from "./radius"
```

**Step 5: Update `src/app/globals.css` to wire tokens into Tailwind `@theme`**

Replace the existing content with:

```css
@import "tailwindcss";

@theme inline {
  --font-display: "Manrope", sans-serif;

  --color-primary:          #3f2d1c;
  --color-background-light: #f7f7f6;
  --color-background-dark:  #1d1915;
}
```

Note: Tailwind v4 handles opacity modifiers (`primary/10`, `primary/20`, etc.) automatically from the base color — no need to define each shade manually.

**Step 6: Verify Tailwind classes still resolve**

```bash
pnpm dev
```
Expected: App loads without CSS errors.

**Step 7: Commit**

```bash
git add src/design-system/tokens/ src/app/globals.css
git commit -m "feat: add design token layer (colors, typography, radius)"
```

---

### ~~Task 4: Design Tokens story page~~ ✓

**Files:**
- ~~Create: `src/design-system/tokens/tokens.stories.tsx`~~
- Done: `src/design-system/Theme.stories.tsx` — Colors, Typography, Radius stories

**Step 1: Create `src/design-system/tokens/tokens.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { colors, typography, radius } from "./index"

// --- Color Swatch helper ---
function Swatch({ name, value, usage }: { name: string; value: string; usage?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-20 w-full rounded-xl shadow-sm" style={{ backgroundColor: value }} />
      <p className="text-xs font-bold">{name}</p>
      <p className="text-[10px] text-slate-500 font-mono">{value}</p>
      {usage && <p className="text-[10px] text-slate-400">{usage}</p>}
    </div>
  )
}

// --- Token page component ---
function TokensPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-16 font-display">
      {/* Colors */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-2">Color Palette</h2>
        <p className="text-sm text-slate-500 mb-8">Brand and semantic color tokens.</p>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-4">Brand</h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Swatch name="Primary"    value={colors.primary}  usage="Main brand color, CTAs" />
          <Swatch name="Background Light" value={colors.bgLight} usage="App surface (light)" />
          <Swatch name="Background Dark"  value={colors.bgDark}  usage="App surface (dark)" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-4">Semantic</h3>
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Swatch name="Success BG"  value={colors.success.bg}   usage="Completed, On Track" />
          <Swatch name="Success Text" value={colors.success.text} usage="emerald-700" />
          <Swatch name="Warning BG"  value={colors.warning.bg}   usage="In Progress, Review" />
          <Swatch name="Warning Text" value={colors.warning.text} usage="amber-700" />
          <Swatch name="Error BG"    value={colors.error.bg}     usage="Late, Destructive" />
          <Swatch name="Error Text"  value={colors.error.text}   usage="red-700" />
          <Swatch name="Info BG"     value={colors.info.bg}      usage="Online lesson mode" />
          <Swatch name="Info Text"   value={colors.info.text}    usage="blue-700" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-4">Text</h3>
        <div className="grid grid-cols-3 gap-4">
          <Swatch name="Text Primary" value={colors.textPrimary} usage="slate-900 — main text" />
          <Swatch name="Text Muted"   value={colors.textMuted}   usage="slate-500 — secondary" />
          <Swatch name="Text Subtle"  value={colors.textSubtle}  usage="slate-400 — timestamps" />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-2">Typography</h2>
        <p className="text-sm text-slate-500 mb-8">Manrope — all weights 200–800.</p>
        <div className="space-y-6">
          {(Object.entries(typography.scale) as [string, Record<string, string>][]).map(([role, styles]) => (
            <div key={role} className="flex items-baseline gap-8 border-b border-primary/5 pb-6">
              <span className="w-28 text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">{role}</span>
              <p className={`${styles.size} ${styles.weight} ${styles.tracking ?? ""} ${styles.leading ?? ""} ${styles.transform ?? ""}`}>
                The quick brown fox
              </p>
              <span className="text-[10px] text-slate-400 ml-auto shrink-0">
                {styles.size} / {styles.weight}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Radius */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-2">Border Radius</h2>
        <p className="text-sm text-slate-500 mb-8">Four tiers from tight to pill.</p>
        <div className="flex gap-8 items-end">
          {(Object.entries(radius) as [string, string][]).map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <div className={`h-16 w-16 bg-primary ${cls}`} />
              <p className="text-xs font-bold">{name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{cls}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta: Meta = {
  title: "Design Tokens",
  component: TokensPage,
  parameters: { layout: "fullscreen" },
}
export default meta

export const Tokens: StoryObj = {}
```

**Step 2: Verify story renders in Storybook**

```bash
pnpm storybook
```
Expected: "Design Tokens" appears as the first entry in the Storybook sidebar. Color swatches, type specimen, and radius examples all render correctly.

**Step 3: Commit**

```bash
git add src/design-system/tokens/tokens.stories.tsx
git commit -m "feat: add Design Tokens story page (colors, typography, radius)"
```

---

## Phase 3: Foundation Atoms

### Task 5: Button atom

**Files:**
- Create: `src/design-system/atoms/Button/Button.tsx`
- Create: `src/design-system/atoms/Button/Button.stories.tsx`

**Step 1: Create `src/design-system/atoms/Button/Button.tsx`**

```tsx
import { type ButtonHTMLAttributes } from "react"
import { Icon } from "../Icon/Icon"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost"
type ButtonSize    = "sm" | "md"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?:    ButtonSize
  loading?: boolean
  iconLeft?: string   // Material Symbol name
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover",
  secondary: "bg-brand-primary-subtle text-brand-primary hover:opacity-90",
  outline:   "border border-brand-primary text-brand-primary hover:bg-brand-primary-subtle",
  ghost:     "text-brand-primary hover:bg-brand-primary-subtle",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9  px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
}

export function Button({
  variant = "primary",
  size    = "md",
  loading = false,
  iconLeft,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-lg font-bold",
        "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Icon name="progress_activity" className="animate-spin" size="sm" />}
      {!loading && iconLeft && <Icon name={iconLeft} size="sm" />}
      {children}
    </button>
  )
}
```

Note: `Icon` is needed here. Build Icon (Task 6) before wiring up `iconLeft` in stories.

**Step 2: Create `src/design-system/atoms/Button/Button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outline", "ghost"] },
    size:    { control: "select", options: ["sm", "md"] },
    loading: { control: "boolean" },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Primary:   Story = { args: { children: "Save Note",   variant: "primary"   } }
export const Secondary: Story = { args: { children: "View All",    variant: "secondary" } }
export const Outline:   Story = { args: { children: "Cancel",      variant: "outline"   } }
export const Ghost:     Story = { args: { children: "Learn more",  variant: "ghost"     } }
export const Small:     Story = { args: { children: "Add",         variant: "primary", size: "sm" } }
export const Loading:   Story = { args: { children: "Saving…",     variant: "primary", loading: true } }
export const Disabled:  Story = { args: { children: "Unavailable", variant: "primary", disabled: true } }

export const ClickFires: Story = {
  args: { children: "Click me", variant: "primary" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: /click me/i })
    await userEvent.click(button)
    // Verifies click is not blocked (disabled/loading would prevent this)
    expect(button).not.toBeDisabled()
  },
}

export const LoadingPreventsClick: Story = {
  args: { children: "Saving…", variant: "primary", loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button")
    expect(button).toBeDisabled()
  },
}
```

**Step 3: Verify all Button stories render correctly**

```bash
pnpm storybook
```
Expected: 7 stories under Atoms/Button. All variants and states visible. Autodocs page shows props table.

**Step 4: Run play functions**

```bash
pnpm storybook:test --url http://localhost:6006
```
Expected: All play functions pass.

**Step 5: Commit**

```bash
git add src/design-system/atoms/Button/
git commit -m "feat: add Button atom with all variants and play functions"
```

---

### Task 6: Icon and Badge atoms

**Files:**
- Create: `src/design-system/atoms/Icon/Icon.tsx`
- Create: `src/design-system/atoms/Icon/Icon.stories.tsx`
- Create: `src/design-system/atoms/Badge/Badge.tsx`
- Create: `src/design-system/atoms/Badge/Badge.stories.tsx`

**Step 1: Create `src/design-system/atoms/Icon/Icon.tsx`**

```tsx
type IconSize = "xs" | "sm" | "md" | "lg"

interface IconProps {
  name: string
  size?: IconSize
  className?: string
  filled?: boolean
}

const sizeClasses: Record<IconSize, string> = {
  xs: "text-base",
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
}

export function Icon({ name, size = "md", className = "", filled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${sizeClasses[size]} ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
    >
      {name}
    </span>
  )
}
```

**Step 2: Create `src/design-system/atoms/Icon/Icon.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Icon } from "./Icon"

const meta: Meta<typeof Icon> = {
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    size:   { control: "select", options: ["xs", "sm", "md", "lg"] },
    filled: { control: "boolean" },
  },
}
export default meta
type Story = StoryObj<typeof Icon>

export const Default:  Story = { args: { name: "music_note", size: "md" } }
export const Filled:   Story = { args: { name: "star",       size: "md", filled: true } }

// Iconography reference
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 text-primary">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon name="music_note" size={size} />
          <span className="text-[10px] text-slate-400">{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const CommonIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 text-primary">
      {["dashboard", "group", "library_music", "chat_bubble", "notifications",
        "person_add", "settings", "search", "calendar_month", "edit_note",
        "assignment", "history_edu", "send", "attach_file"].map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Icon name={name} />
          <span className="text-[10px] text-slate-400">{name}</span>
        </div>
      ))}
    </div>
  ),
}
```

**Step 3: Create `src/design-system/atoms/Badge/Badge.tsx`**

```tsx
type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral"

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100  text-amber-700",
  error:   "bg-red-100    text-red-700",
  info:    "bg-blue-100   text-blue-700",
  neutral: "bg-primary/10 text-primary",
}

export function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-0.5 rounded-full",
        "text-[10px] font-bold uppercase tracking-wider",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  )
}
```

**Step 4: Create `src/design-system/atoms/Badge/Badge.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./Badge"

const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["success", "warning", "error", "info", "neutral"] },
  },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Success: Story = { args: { variant: "success", children: "Completed"  } }
export const Warning: Story = { args: { variant: "warning", children: "In Progress" } }
export const Error:   Story = { args: { variant: "error",   children: "Late"        } }
export const Info:    Story = { args: { variant: "info",    children: "Online"      } }
export const Neutral: Story = { args: { variant: "neutral", children: "Archived"   } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">In Progress</Badge>
      <Badge variant="error">Late</Badge>
      <Badge variant="info">Online</Badge>
      <Badge variant="neutral">Archived</Badge>
    </div>
  ),
}
```

**Step 5: Verify in Storybook and commit**

```bash
pnpm storybook
git add src/design-system/atoms/Icon/ src/design-system/atoms/Badge/
git commit -m "feat: add Icon and Badge atoms"
```

---

### Task 7: Avatar atom

**Files:**
- Create: `src/design-system/atoms/Avatar/Avatar.tsx`
- Create: `src/design-system/atoms/Avatar/Avatar.stories.tsx`

**Step 1: Create `src/design-system/atoms/Avatar/Avatar.tsx`**

```tsx
type AvatarSize = "sm" | "md" | "lg"

interface AvatarProps {
  src?:     string
  name?:    string   // used for fallback initials
  size?:    AvatarSize
  showDot?: boolean  // online/activity indicator
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-8  text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
}

const dotSizeClasses: Record<AvatarSize, string> = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
}

function initials(name?: string): string {
  if (!name) return "?"
  const parts = name.trim().split(" ")
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase()
}

export function Avatar({ src, name, size = "md", showDot = false, className = "" }: AvatarProps) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <div
          className={`${sizeClasses[size]} rounded-full bg-cover bg-center border-2 border-white/20`}
          style={{ backgroundImage: `url(${src})` }}
          aria-label={name}
          role="img"
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center`}
          aria-label={name}
        >
          {initials(name)}
        </div>
      )}
      {showDot && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizeClasses[size]} rounded-full bg-primary border-2 border-white`}
        />
      )}
    </div>
  )
}
```

**Step 2: Create `src/design-system/atoms/Avatar/Avatar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Avatar } from "./Avatar"

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size:    { control: "select", options: ["sm", "md", "lg"] },
    showDot: { control: "boolean" },
  },
}
export default meta
type Story = StoryObj<typeof Avatar>

export const WithInitials: Story = { args: { name: "Mia Chen",   size: "md" } }
export const WithDot:      Story = { args: { name: "Julian R.",  size: "md", showDot: true } }
export const Small:        Story = { args: { name: "Leo H.",     size: "sm" } }
export const Large:        Story = { args: { name: "Ms. Rivera", size: "lg" } }

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar name="Mia Chen" size="sm" />
      <Avatar name="Mia Chen" size="md" showDot />
      <Avatar name="Mia Chen" size="lg" />
    </div>
  ),
}
```

**Step 3: Verify and commit**

```bash
git add src/design-system/atoms/Avatar/
git commit -m "feat: add Avatar atom with initials fallback and status dot"
```

---

### Task 8: Typography atoms (Heading, Text, Label, Caption, Divider)

**Files:**
- Create: `src/design-system/atoms/Typography/Typography.tsx`
- Create: `src/design-system/atoms/Typography/Typography.stories.tsx`

**Step 1: Create `src/design-system/atoms/Typography/Typography.tsx`**

```tsx
import { type ReactNode, type ElementType } from "react"

interface HeadingProps {
  level?: "displayLg" | "displayMd" | "displaySm"
  as?:    "h1" | "h2" | "h3" | "h4"
  children: ReactNode
  className?: string
}

const headingClasses = {
  displayLg: "text-4xl font-extrabold tracking-tight",
  displayMd: "text-2xl font-bold tracking-tight",
  displaySm: "text-xl  font-bold tracking-tight",
}

export function Heading({ level = "displayMd", as: Tag = "h2", children, className = "" }: HeadingProps) {
  return <Tag className={`${headingClasses[level]} ${className}`}>{children}</Tag>
}

interface TextProps {
  size?:  "lg" | "sm"
  muted?: boolean
  children: ReactNode
  className?: string
}

export function Text({ size = "lg", muted = false, children, className = "" }: TextProps) {
  return (
    <p className={[
      size === "lg" ? "text-base leading-relaxed" : "text-sm leading-relaxed",
      muted ? "text-primary/60" : "text-slate-900 dark:text-slate-100",
      className,
    ].join(" ")}>
      {children}
    </p>
  )
}

interface LabelProps {
  children: ReactNode
  className?: string
}

export function Label({ children, className = "" }: LabelProps) {
  return (
    <span className={`text-xs font-bold uppercase tracking-widest text-primary/60 ${className}`}>
      {children}
    </span>
  )
}

interface CaptionProps {
  children: ReactNode
  className?: string
}

export function Caption({ children, className = "" }: CaptionProps) {
  return (
    <span className={`text-xs font-medium text-primary/40 ${className}`}>
      {children}
    </span>
  )
}

interface DividerProps {
  label?: string
  className?: string
}

export function Divider({ label, className = "" }: DividerProps) {
  if (!label) {
    return <hr className={`border-primary/10 ${className}`} />
  }
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-primary/10" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">{label}</span>
      <div className="h-px flex-1 bg-primary/10" />
    </div>
  )
}
```

**Step 2: Create `src/design-system/atoms/Typography/Typography.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Heading, Text, Label, Caption, Divider } from "./Typography"

const meta: Meta = { title: "Atoms/Typography", tags: ["autodocs"] }
export default meta
type Story = StoryObj

export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level="displayLg">Today at a Glance</Heading>
      <Heading level="displayMd">Recent Activity</Heading>
      <Heading level="displaySm">Mia Chen</Heading>
    </div>
  ),
}

export const BodyText: Story = {
  render: () => (
    <div className="space-y-3">
      <Text>Mia is showing great improvement in her rhythm exercises.</Text>
      <Text size="sm" muted>Thursday, October 24th — 4 lessons scheduled</Text>
    </div>
  ),
}

export const Labels: Story = {
  render: () => (
    <div className="space-y-3">
      <Label>Current Progress</Label>
      <Label>Activity This Month</Label>
    </div>
  ),
}

export const Captions: Story = {
  render: () => (
    <div className="space-y-2">
      <Caption>10 minutes ago</Caption>
      <Caption>Piano • Grade 3</Caption>
    </div>
  ),
}

export const DividerPlain: Story = {
  render: () => <div className="w-80"><Divider /></div>,
}

export const DividerWithLabel: Story = {
  render: () => <div className="w-80"><Divider label="Tuesday, Feb 20" /></div>,
}
```

**Step 3: Verify and commit**

```bash
git add src/design-system/atoms/Typography/
git commit -m "feat: add Typography atoms (Heading, Text, Label, Caption, Divider)"
```

---

### Task 9: Form atoms (Input, Textarea, Select, Toggle, ProgressBar)

**Files:**
- Create: `src/design-system/atoms/Input/Input.tsx` + `Input.stories.tsx`
- Create: `src/design-system/atoms/Textarea/Textarea.tsx` + `Textarea.stories.tsx`
- Create: `src/design-system/atoms/Select/Select.tsx` + `Select.stories.tsx`
- Create: `src/design-system/atoms/Toggle/Toggle.tsx` + `Toggle.stories.tsx`
- Create: `src/design-system/atoms/ProgressBar/ProgressBar.tsx` + `ProgressBar.stories.tsx`

**Step 1: Create `src/design-system/atoms/Input/Input.tsx`**

```tsx
import { type InputHTMLAttributes } from "react"
import { Icon } from "../Icon/Icon"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: string
  error?:       string
  label?:       string
}

export function Input({ leadingIcon, error, label, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40">
            <Icon name={leadingIcon} size="sm" />
          </span>
        )}
        <input
          id={id}
          className={[
            "w-full rounded-lg border bg-white dark:bg-background-dark",
            "px-4 py-3 text-base placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
            leadingIcon ? "pl-10" : "",
            error ? "border-red-400 focus:ring-red-400" : "border-primary/20",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
}
```

**Step 2: Create `src/design-system/atoms/Input/Input.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"
import { Input } from "./Input"

const meta: Meta<typeof Input> = { component: Input, tags: ["autodocs"] }
export default meta
type Story = StoryObj<typeof Input>

export const Default:     Story = { args: { placeholder: "Enter first name", label: "First Name" } }
export const WithIcon:    Story = { args: { placeholder: "Search students…", leadingIcon: "search" } }
export const WithError:   Story = { args: { placeholder: "Email", label: "Email", error: "Please enter a valid email address" } }
export const Email:       Story = { args: { type: "email", placeholder: "sarah@example.com", label: "Guardian Email", leadingIcon: "mail" } }
export const Password:    Story = { args: { type: "password", placeholder: "••••••••", label: "Password" } }

export const TypesText: Story = {
  args: { placeholder: "Enter name…", label: "Name" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("textbox")
    await userEvent.type(input, "Mia Chen")
    expect(input).toHaveValue("Mia Chen")
  },
}
```

**Step 3: Create `src/design-system/atoms/Textarea/Textarea.tsx`**

```tsx
import { type TextareaHTMLAttributes } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, id, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-bold text-primary">{label}</label>}
      <textarea
        id={id}
        rows={3}
        className={[
          "w-full rounded-lg border bg-white dark:bg-background-dark",
          "px-4 py-3 text-sm placeholder:text-slate-400 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
          error ? "border-red-400" : "border-primary/20",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
}
```

**Step 4: Create `src/design-system/atoms/Select/Select.tsx`**

```tsx
import { type SelectHTMLAttributes } from "react"
import { Icon } from "../Icon/Icon"

interface SelectOption { value: string; label: string }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string
  error?:   string
  options:  SelectOption[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, id, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-bold text-primary">{label}</label>}
      <div className="relative">
        <select
          id={id}
          className={[
            "w-full appearance-none rounded-lg border bg-white dark:bg-background-dark",
            "px-4 py-3 pr-10 text-base",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
            error ? "border-red-400" : "border-primary/20",
            className,
          ].join(" ")}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Icon name="unfold_more" size="sm" />
        </span>
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
}
```

**Step 5: Create `src/design-system/atoms/Toggle/Toggle.tsx`**

```tsx
import { type InputHTMLAttributes } from "react"

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label:       string
  description?: string
}

export function Toggle({ label, description, id, className = "", ...props }: ToggleProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-primary/5 ${className}`}>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</span>
        {description && <span className="text-xs text-slate-500 mt-0.5">{description}</span>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input id={id} type="checkbox" className="sr-only peer" role="switch" {...props} />
        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all" />
      </label>
    </div>
  )
}
```

**Step 6: Create `src/design-system/atoms/Toggle/Toggle.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"
import { Toggle } from "./Toggle"

const meta: Meta<typeof Toggle> = { component: Toggle, tags: ["autodocs"] }
export default meta
type Story = StoryObj<typeof Toggle>

export const Off: Story = {
  args: { label: "Messaging Participation", description: "Allow student to participate in chats" },
}
export const On: Story = {
  args: { label: "Messaging Participation", description: "Allow student to participate in chats", defaultChecked: true },
}

export const TogglesOn: Story = {
  args: { label: "Email Notifications" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("switch")
    expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    expect(toggle).toBeChecked()
  },
}

export const TogglesOff: Story = {
  args: { label: "Public Profile", defaultChecked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("switch")
    expect(toggle).toBeChecked()
    await userEvent.click(toggle)
    expect(toggle).not.toBeChecked()
  },
}
```

**Step 7: Create `src/design-system/atoms/ProgressBar/ProgressBar.tsx`**

```tsx
type ProgressVariant = "primary" | "success" | "warning"

interface ProgressBarProps {
  value:     number   // 0–100
  variant?:  ProgressVariant
  showLabel?: boolean
  className?: string
}

const fillClasses: Record<ProgressVariant, string> = {
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
}

export function ProgressBar({ value, variant = "primary", showLabel = false, className = "" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 w-full bg-primary/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${fillClasses[variant]}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <span className="text-xs font-bold text-primary shrink-0">{pct}%</span>}
    </div>
  )
}
```

**Step 8: Add stories for remaining form atoms and ProgressBar**

Create `Textarea.stories.tsx`, `Select.stories.tsx`, and `ProgressBar.stories.tsx` following the same pattern as Input.stories.tsx — one story per meaningful state (default, error, different options/values).

**Step 9: Verify and commit**

```bash
git add src/design-system/atoms/Input/ src/design-system/atoms/Textarea/ \
        src/design-system/atoms/Select/ src/design-system/atoms/Toggle/ \
        src/design-system/atoms/ProgressBar/
git commit -m "feat: add form atoms (Input, Textarea, Select, Toggle, ProgressBar)"
```

---

## Phase 4: Core Molecules

### Task 10: FormField and SearchBar molecules

**Files:**
- Create: `src/design-system/molecules/FormField/FormField.tsx` + `FormField.stories.tsx`
- Create: `src/design-system/molecules/SearchBar/SearchBar.tsx` + `SearchBar.stories.tsx`

**Step 1: Create `src/design-system/molecules/FormField/FormField.tsx`**

FormField composes `Input`/`Select`/`Textarea` with a `Label` above and error/hint `Caption` below. This is the molecule used in all forms (New Student, Login, etc.).

```tsx
import { Input } from "../../atoms/Input/Input"
import { Select } from "../../atoms/Select/Select"
import { Textarea } from "../../atoms/Textarea/Textarea"

export { Input as FormInput, Select as FormSelect, Textarea as FormTextarea }

// FormField is a thin wrapper that enforces consistent label/error layout.
// Use Input, Select, or Textarea directly — they already accept label/error props.
// FormField is exported as a namespace for clarity in form code:
//   <FormField.Input label="First Name" ... />
//   <FormField.Select label="Instrument" options={...} ... />
export const FormField = {
  Input,
  Select,
  Textarea,
}
```

**Step 2: Create `src/design-system/molecules/FormField/FormField.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"
import { FormField } from "./FormField"

const meta: Meta = { title: "Molecules/FormField", tags: ["autodocs"] }
export default meta
type Story = StoryObj

export const TextInput: Story = {
  render: () => <FormField.Input label="First Name" placeholder="e.g. Julian" />,
}

export const SelectInput: Story = {
  render: () => (
    <FormField.Select
      label="Instrument"
      placeholder="Select instrument"
      options={[
        { value: "piano",  label: "Piano"  },
        { value: "violin", label: "Violin" },
        { value: "cello",  label: "Cello"  },
      ]}
    />
  ),
}

export const WithValidationError: Story = {
  render: () => (
    <FormField.Input
      label="Contact Email"
      placeholder="sarah@example.com"
      leadingIcon="mail"
      error="Please enter a valid email address"
    />
  ),
}

export const NewStudentForm: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <FormField.Input label="First Name" placeholder="e.g. Julian" />
      <FormField.Input label="Last Name"  placeholder="e.g. Smith"  />
      <FormField.Select
        label="Proficiency Level"
        placeholder="Select level"
        options={[
          { value: "beginner",     label: "Beginner"     },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced",     label: "Advanced"     },
        ]}
      />
      <FormField.Select
        label="Instrument"
        placeholder="Select instrument"
        options={[
          { value: "piano",  label: "Piano"  },
          { value: "violin", label: "Violin" },
        ]}
      />
    </div>
  ),
}
```

**Step 3: Create `src/design-system/molecules/SearchBar/SearchBar.tsx`**

```tsx
import { type InputHTMLAttributes } from "react"
import { Icon } from "../../atoms/Icon/Icon"
import { Button } from "../../atoms/Button/Button"

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onFilter?: () => void
}

export function SearchBar({ onFilter, className = "", ...props }: SearchBarProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">
          <Icon name="search" size="sm" />
        </span>
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border-none bg-primary/5 text-sm placeholder:text-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...props}
        />
      </div>
      {onFilter && (
        <Button variant="secondary" size="sm" iconLeft="tune" onClick={onFilter} aria-label="Filter">
          Filter
        </Button>
      )}
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add src/design-system/molecules/FormField/ src/design-system/molecules/SearchBar/
git commit -m "feat: add FormField and SearchBar molecules"
```

---

### Task 11: NavItem, LessonCard, StudentRow, AssignmentRow molecules

**Files:**
- Create: `src/design-system/molecules/NavItem/NavItem.tsx` + `NavItem.stories.tsx`
- Create: `src/design-system/molecules/LessonCard/LessonCard.tsx` + `LessonCard.stories.tsx`
- Create: `src/design-system/molecules/StudentRow/StudentRow.tsx` + `StudentRow.stories.tsx`
- Create: `src/design-system/molecules/AssignmentRow/AssignmentRow.tsx` + `AssignmentRow.stories.tsx`

**Step 1: Create `src/design-system/molecules/NavItem/NavItem.tsx`**

```tsx
import { Icon } from "../../atoms/Icon/Icon"

interface NavItemProps {
  icon:     string
  label:    string
  active?:  boolean
  badge?:   number | string
  dot?:     boolean
  onClick?: () => void
}

export function NavItem({ icon, label, active = false, badge, dot, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
        active
          ? "bg-primary text-white"
          : "text-primary/70 hover:bg-primary/5",
      ].join(" ")}
    >
      <Icon name={icon} size="sm" />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {dot && !badge && (
        <span className="absolute right-4 h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  )
}
```

**Step 2: Create `src/design-system/molecules/LessonCard/LessonCard.tsx`**

```tsx
import { Avatar } from "../../atoms/Avatar/Avatar"
import { Badge } from "../../atoms/Badge/Badge"
import { Icon } from "../../atoms/Icon/Icon"

type LessonMode = "in_studio" | "online"

interface LessonCardProps {
  studentName:  string
  studentImage?: string
  instrument:   string
  level:        string
  time:         string
  mode:         LessonMode
}

export function LessonCard({ studentName, studentImage, instrument, level, time, mode }: LessonCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-primary/5 hover:shadow-md transition-all">
      <div className="flex items-center gap-4 mb-4">
        <Avatar src={studentImage} name={studentName} size="md" />
        <div>
          <h3 className="font-bold text-primary">{studentName}</h3>
          <p className="text-xs text-primary/60">{instrument} • {level}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1 text-primary/80 font-medium">
          <Icon name={mode === "online" ? "videocam" : "schedule"} size="xs" />
          {time}
        </span>
        <Badge variant={mode === "online" ? "info" : "neutral"}>
          {mode === "online" ? "Online" : "In Studio"}
        </Badge>
      </div>
    </div>
  )
}
```

**Step 3: Create `src/design-system/molecules/StudentRow/StudentRow.tsx`**

```tsx
import { Avatar } from "../../atoms/Avatar/Avatar"
import { Icon } from "../../atoms/Icon/Icon"

interface StudentRowProps {
  name:       string
  image?:     string
  instrument?: string
  detail?:    string   // e.g. "Recital in 4 days" or "3 New Guardian Notes"
  onClick?:   () => void
}

export function StudentRow({ name, image, instrument, detail, onClick }: StudentRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-primary/5 hover:border-primary/20 transition-all"
    >
      <Avatar name={name} src={image} size="md" showDot />
      <div className="flex-1 text-left">
        <h4 className="text-sm font-bold text-primary leading-none">{name}</h4>
        {detail && <p className="text-xs text-primary/60 mt-1">{detail}</p>}
        {instrument && !detail && <p className="text-xs text-primary/60 mt-1">{instrument}</p>}
      </div>
      <Icon name="chevron_right" size="sm" className="text-primary/30" />
    </button>
  )
}
```

**Step 4: Create `src/design-system/molecules/AssignmentRow/AssignmentRow.tsx`**

```tsx
import { Badge } from "../../atoms/Badge/Badge"
import { Icon } from "../../atoms/Icon/Icon"

type AssignmentStatus = "active" | "completed" | "dropped" | "review"

interface AssignmentRowProps {
  index?:      number
  title:       string
  subtitle?:   string
  status:      AssignmentStatus
  onClick?:    () => void
}

const statusConfig: Record<AssignmentStatus, { variant: "success" | "warning" | "error" | "neutral"; label: string }> = {
  active:    { variant: "warning", label: "In Progress" },
  completed: { variant: "success", label: "Completed"   },
  dropped:   { variant: "neutral", label: "Dropped"     },
  review:    { variant: "warning", label: "Review Required" },
}

export function AssignmentRow({ index, title, subtitle, status, onClick }: AssignmentRowProps) {
  const { variant, label } = statusConfig[status]
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between p-4 bg-white dark:bg-background-dark border border-primary/10 rounded-xl hover:border-primary/30 transition-all"
    >
      <div className="flex items-center gap-4">
        {index !== undefined && (
          <div className="size-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {String(index).padStart(2, "0")}
          </div>
        )}
        <div className="text-left">
          <p className="text-sm font-bold text-primary">{title}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={variant}>{label}</Badge>
        <Icon name="chevron_right" size="sm" className="text-slate-300 group-hover:text-primary transition-colors" />
      </div>
    </button>
  )
}
```

**Step 5: Add stories for all four molecules following the pattern from previous tasks. Include an AllStates story for each that renders every variant/state side by side.**

**Step 6: Commit**

```bash
git add src/design-system/molecules/NavItem/ src/design-system/molecules/LessonCard/ \
        src/design-system/molecules/StudentRow/ src/design-system/molecules/AssignmentRow/
git commit -m "feat: add NavItem, LessonCard, StudentRow, AssignmentRow molecules"
```

---

### Task 12: MessageBubble, NoteCard, ThreadPreview, ActivityItem, StatCard, MilestoneCard

Follow the same build pattern for the remaining molecules. Each gets a `.tsx` + `.stories.tsx` with stories for all meaningful states.

**Key implementation notes:**

- **MessageBubble** — accepts `variant: "sent" | "received"`. Sent: `bg-primary text-white`, rounded-br-none. Received: `bg-white border`, rounded-bl-none. Accepts `readBy?: string` for read receipts on sent messages.
- **NoteCard** — accepts `authorRole: "teacher" | "guardian"`. Teacher notes have `border-l-4 border-primary`. Guardian notes have `border-l-4 border-slate-400`. Accepts `body`, `authorName`, `timestamp`.
- **ThreadPreview** — accepts `participants: Array<{name, image?}>` (stacked avatars, max 2 shown + count), `subject`, `preview`, `timestamp`, `unread?: boolean`.
- **ActivityItem** — accepts `icon`, `iconVariant: "primary" | "blue" | "orange"`, `title`, `description`, `timestamp`.
- **StatCard** — accepts `label`, `value` (string), `trend?: { direction: "up"|"down", label: string }`.
- **MilestoneCard** — accepts `title`, `progress` (0–100), `targetDate`, `venue?`, `focusItems?: Array<{label, done}>`.

**Commit after all six are done:**

```bash
git add src/design-system/molecules/MessageBubble/ src/design-system/molecules/NoteCard/ \
        src/design-system/molecules/ThreadPreview/ src/design-system/molecules/ActivityItem/ \
        src/design-system/molecules/StatCard/ src/design-system/molecules/MilestoneCard/
git commit -m "feat: add remaining molecules (MessageBubble, NoteCard, ThreadPreview, ActivityItem, StatCard, MilestoneCard)"
```

---

## Phase 5: Organisms

### Task 13: AppHeader and AppSidebar organisms

**Files:**
- Create: `src/design-system/organisms/AppHeader/AppHeader.tsx` + `AppHeader.stories.tsx`
- Create: `src/design-system/organisms/AppSidebar/AppSidebar.tsx` + `AppSidebar.stories.tsx`

**Step 1: Create `AppHeader`**

Accepts `userName`, `userRole`, `userImage?`, `onNotifications`, `onSearch`. Composes `Avatar`, `Icon`, `SearchBar`.

```tsx
import { Avatar } from "../../atoms/Avatar/Avatar"
import { Icon }   from "../../atoms/Icon/Icon"
import { SearchBar } from "../../molecules/SearchBar/SearchBar"

interface AppHeaderProps {
  userName:       string
  userRole:       string
  userImage?:     string
  searchPlaceholder?: string
  onNotifications?: () => void
}

export function AppHeader({ userName, userRole, userImage, searchPlaceholder, onNotifications }: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-primary/10 bg-white dark:bg-background-dark px-6 z-20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-primary">
          <Icon name="music_note" size="lg" />
          <h1 className="text-xl font-bold tracking-tight">Cantura</h1>
        </div>
        {searchPlaceholder && (
          <div className="hidden md:block w-64">
            <SearchBar placeholder={searchPlaceholder} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNotifications}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-primary"
          aria-label="Notifications"
        >
          <Icon name="notifications" size="sm" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">{userName}</p>
            <p className="text-xs text-primary/60">{userRole}</p>
          </div>
          <Avatar name={userName} src={userImage} size="md" />
        </div>
      </div>
    </header>
  )
}
```

**Step 2: Create `AppSidebar`**

Accepts `role: "teacher" | "guardian" | "student"`, `activeItem`, `onNavigate`. Renders role-appropriate nav items using `NavItem`. Teacher variant adds "New Student" CTA at bottom.

**Step 3: Create stories for both — include role variants for AppSidebar (TeacherSidebar, GuardianSidebar, StudentSidebar).**

**Step 4: Commit**

```bash
git add src/design-system/organisms/AppHeader/ src/design-system/organisms/AppSidebar/
git commit -m "feat: add AppHeader and AppSidebar organisms"
```

---

### Task 14: Remaining organisms

Build the remaining organisms following the same pattern. Each composes molecules and atoms established in earlier tasks.

**LessonGrid** — wraps `LessonCard` in a responsive CSS grid. Accepts `lessons: LessonCardProps[]`.

**ActivityFeed** — wraps `ActivityItem` list. Accepts `items`, `onMarkAllRead`. Includes "View Full History" button.

**PriorityStudentList** — wraps `StudentRow` list. Accepts `students`, `onManageWatchlist`.

**PracticeNoteThread** — scrollable thread of `NoteCard` items (teacher/guardian notes). Includes reply `Textarea` + `Button` at bottom. Accepts `notes: NoteCardProps[]`, `onReply(content)`.

**MessagingThread** — full chat view. Accepts `messages: MessageBubbleProps[]`, `participants`, `onSend(body)`. Groups messages with `Divider` date labels.

**AssignmentList** — `AssignmentRow` list with Active/Completed tab toggle via `Badge`-style buttons. Accepts `assignments`, `activeFilter`, `onFilterChange`.

**StudentHubHeader** — student profile block for teacher view. Accepts `student`, `onAddNote`, `onAssignPiece`.

**StudentCard** — full student summary card. Accepts `student`, `latestNote`, `progress`.

**Commit after all organisms:**

```bash
git add src/design-system/organisms/
git commit -m "feat: add remaining organisms (LessonGrid, ActivityFeed, MessagingThread, etc.)"
```

---

## Phase 6: CI Integration

### Task 15: Add storybook:test to CI

**Files:**
- Create or modify: `.github/workflows/ci.yml`

**Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main, "feat/**"]
  pull_request:

jobs:
  storybook-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright
        run: pnpm exec playwright install chromium --with-deps

      - name: Build Storybook
        run: pnpm storybook:build

      - name: Run Storybook tests
        run: |
          pnpm dlx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
            "pnpm dlx http-server storybook-static --port 6006 --silent" \
            "pnpm dlx wait-on tcp:6006 && pnpm storybook:test --url http://localhost:6006"
```

**Step 2: Verify CI runs locally**

```bash
pnpm storybook:build
pnpm storybook:test --url http://localhost:6006
```
Expected: All play functions pass.

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: add Storybook play function tests to CI"
```

---

## Design System Index Export

After all components are built, create a barrel export file so pages can import cleanly:

**Create `src/design-system/index.ts`:**

```ts
// Tokens
export * from "./tokens"

// Atoms
export { Button }      from "./atoms/Button/Button"
export { Icon }        from "./atoms/Icon/Icon"
export { Badge }       from "./atoms/Badge/Badge"
export { Avatar }      from "./atoms/Avatar/Avatar"
export { Input }       from "./atoms/Input/Input"
export { Textarea }    from "./atoms/Textarea/Textarea"
export { Select }      from "./atoms/Select/Select"
export { Toggle }      from "./atoms/Toggle/Toggle"
export { ProgressBar } from "./atoms/ProgressBar/ProgressBar"
export { Heading, Text, Label, Caption, Divider } from "./atoms/Typography/Typography"

// Molecules
export { FormField }      from "./molecules/FormField/FormField"
export { SearchBar }      from "./molecules/SearchBar/SearchBar"
export { NavItem }        from "./molecules/NavItem/NavItem"
export { MessageBubble }  from "./molecules/MessageBubble/MessageBubble"
export { NoteCard }       from "./molecules/NoteCard/NoteCard"
export { StudentRow }     from "./molecules/StudentRow/StudentRow"
export { LessonCard }     from "./molecules/LessonCard/LessonCard"
export { AssignmentRow }  from "./molecules/AssignmentRow/AssignmentRow"
export { ThreadPreview }  from "./molecules/ThreadPreview/ThreadPreview"
export { ActivityItem }   from "./molecules/ActivityItem/ActivityItem"
export { StatCard }       from "./molecules/StatCard/StatCard"
export { MilestoneCard }  from "./molecules/MilestoneCard/MilestoneCard"

// Organisms
export { AppHeader }           from "./organisms/AppHeader/AppHeader"
export { AppSidebar }          from "./organisms/AppSidebar/AppSidebar"
export { LessonGrid }          from "./organisms/LessonGrid/LessonGrid"
export { ActivityFeed }        from "./organisms/ActivityFeed/ActivityFeed"
export { PriorityStudentList } from "./organisms/PriorityStudentList/PriorityStudentList"
export { PracticeNoteThread }  from "./organisms/PracticeNoteThread/PracticeNoteThread"
export { MessagingThread }     from "./organisms/MessagingThread/MessagingThread"
export { AssignmentList }      from "./organisms/AssignmentList/AssignmentList"
export { StudentHubHeader }    from "./organisms/StudentHubHeader/StudentHubHeader"
export { StudentCard }         from "./organisms/StudentCard/StudentCard"
```

```bash
git add src/design-system/index.ts
git commit -m "chore: add design-system barrel export"
```
