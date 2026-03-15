# Cantura Atomic Implementation Plan (Page-to-Component Mapping)

**Date:** 2026-03-15  
**Status:** Active  
**Owner:** Product/Design + Engineering

This document converts the full-page mockups in `docs/designs/` into a reusable atomic system under `src/design-system/`.

## 1) Why this plan exists

The goal is to prevent page-level UI duplication while making every page faster to build and easier to maintain.

- Each reusable component has one canonical location.
- Each page maps to shared components.
- New components are added only when existing atoms/molecules/organisms cannot be adapted by props or variants.

## 2) Inputs

- [2026-03-10-component-library-design.md](/Users/contr/Code/cantura/docs/plans/2026-03-10-component-library-design.md)
- [2026-03-10-component-library-plan.md](/Users/contr/Code/cantura/docs/plans/2026-03-10-component-library-plan.md)
- Mocks in [docs/designs](/Users/contr/Code/cantura/docs/designs):
  - `teacher_dashboard_refined`
  - `guardian_dashboard`
  - `student_dashboard_refined`
  - `student_hub_mia_chen`
  - `messaging_inbox`
  - `new_student_creation_form`
  - `expanded_style_guide_refined`
  - `cantura_component_library_refined`

## 3) Does this mapping prevent duplicate atomic components?

Yes. This mapping is the control mechanism.

- Each reusable component has one canonical file under `src/design-system/`.
- Pages must declare which canonical components they consume.
- If two pages need similar UI, we prefer:
  1. prop extension,
  2. variant extension,
  3. slot/render extension,
  4. new component only as last resort.

## 4) Reuse governance rules (mandatory)

1. **Canonical structure**
   - tokens: `src/design-system/tokens/*`
   - atoms: `src/design-system/atoms/*`
   - molecules: `src/design-system/molecules/*`
   - organisms: `src/design-system/organisms/*`

2. **No per-page atoms**
   - Before adding any atom, check if a variant or prop expansion can satisfy the requirement.

3. **State coverage required**
   - default, hover/focus, active/selected, disabled, loading, error, empty

4. **Single source of truth mapping**
   - This document defines where each component is used and who owns it.

## 5) Canonical component registry (single definitions)

### Shared atoms
- `Icon` (Material Symbols wrapper)
- `Button` (primary/secondary/outline/ghost, sm/md, loading/disabled)
- `Input` (text/email/password/search variants), `Textarea`, `Select`, `Toggle`, `ProgressBar`
- `Badge`, `Avatar`, and typography primitives (`Heading`, `Text`, `Label`, `Caption`, `Divider`)

### Shared molecules
- `FormField`
- `SearchBar`
- `NavItem`
- `StudentRow`
- `LessonCard`
- `AssignmentRow`
- `ThreadPreview`
- `ActivityItem`
- `MessageBubble`
- `NoteCard`
- `StatCard`
- `MilestoneCard`

### Shared organisms
- `AppHeader`
- `AppSidebar`
- `LessonGrid`
- `ActivityFeed`
- `PriorityStudentList`
- `PracticeNoteThread`
- `MessagingThread`
- `AssignmentList`
- `StudentHubHeader`
- `StudentCard`

## 6) Page-to-component mapping

### Teacher Dashboard (`teacher_dashboard_refined`)

Use shared components:
- `AppHeader` (`role="teacher"`)
- `AppSidebar` (`role="teacher"`)
- `LessonGrid` (`LessonCard[]`)
- `ActivityFeed` (`ActivityItem[]`)
- `PriorityStudentList` (`StudentRow[]`)
- `SearchBar`
- Reused atoms: `Button`, `Icon`, `Avatar`, `Badge`, `ProgressBar`

### Guardian Dashboard (`guardian_dashboard`)

Use shared components:
- `AppHeader` (guardian variant)
- `AppSidebar` (`role="guardian"`)
- `StudentCard`
- `LessonCard`
- `ActivityFeed` + `ActivityItem`
- `PriorityStudentList`
- `StatCard`
- `MilestoneCard`
- `Badge`, `ProgressBar`

### Student Dashboard (`student_dashboard_refined`)

Use shared components:
- `AppHeader` (`role="student"`)
- `AppSidebar` (`role="student"`)
- `StudentHubHeader`
- `StatCard` (compact/trend variants)
- `AssignmentList` (`AssignmentRow[]`)
- `MessagingThread` (notes/messages)
- `ProgressBar`
- `Button`, `Icon`, `Badge`

### Student Hub (`student_hub_mia_chen`)

Use shared components:
- `StudentHubHeader`
- `PracticeNoteThread`
- `NoteCard`
- `AppSidebar`, `AppHeader` if shared frame is used
- `MessageBubble`
- `FormField`, `Input` for note compose

### Messaging Inbox (`messaging_inbox`)

Use shared components:
- `AppHeader` (simple variant)
- `ThreadPreview` list
- `MessagingThread`
- `MessageBubble` (sent/received)
- `Divider`
- `Textarea` + `Button`

### New Student Creation Form (`new_student_creation_form`)

Use shared components:
- `AppHeader`
- `FormField.Input`
- `FormField.Select`
- `Toggle`
- `Button`
- `Avatar`
- `Divider`, `Caption`

### Reference docs only (`expanded_style_guide_refined`, `cantura_component_library_refined`)

These are not implementation pages. They provide canonical visual and interaction references.

## 7) Atomic ownership matrix (where each component belongs)

| Component | Scope | Reused by pages | Implementation owner |
|---|---|---|---|
| `Icon` | atoms | all | UI kit |
| `Button` | atoms | all | UI kit |
| `Input` | atoms | new student form, messaging composer, search fields | UI kit |
| `Textarea` | atoms | messaging composer, note composer | UI kit |
| `Select` | atoms | new student form | UI kit |
| `Toggle` | atoms | settings/flags | UI kit |
| `Badge` | atoms | dashboards, lists, message/status | UI kit |
| `Avatar` | atoms | all | UI kit |
| `ProgressBar` | atoms | guardian, student, milestone views | UI kit |
| `Heading/Text/Label/Caption/Divider` | atoms | all | UI kit |
| `FormField` | molecules | new student form, hub form sections | UI kit |
| `SearchBar` | molecules | teacher dashboard, inbox, student hub | UI kit |
| `NavItem` | molecules | sidebar/nav variants | UI kit |
| `LessonCard` | molecules | teacher, guardian dashboards | UI kit |
| `StudentRow` | molecules | teacher/guardian dashboards | UI kit |
| `AssignmentRow` | molecules | student/guardian assignment areas | UI kit |
| `MessageBubble` | molecules | messaging + practice notes | UI kit |
| `ThreadPreview` | molecules | messaging inbox | UI kit |
| `ActivityItem` | molecules | dashboards and activity streams | UI kit |
| `NoteCard` | molecules | student hub + practice notes | UI kit |
| `StatCard` | molecules | student and guardian dashboards | UI kit |
| `MilestoneCard` | molecules | guardian/student milestones | UI kit |
| `AppHeader` | organisms | all routed app pages | Layout |
| `AppSidebar` | organisms | teacher/guardian/student dashboards | Layout |
| `LessonGrid` | organisms | teacher dashboard | Layout |
| `ActivityFeed` | organisms | teacher/guardian dashboards | Layout |
| `PriorityStudentList` | organisms | teacher/guardian dashboards | Layout |
| `PracticeNoteThread` | organisms | student hub | Layout |
| `MessagingThread` | organisms | messaging inbox | Layout |
| `AssignmentList` | organisms | student/guardian assignment areas | Layout |
| `StudentHubHeader` | organisms | student hub | Student area |
| `StudentCard` | organisms | guardian dashboard (and potential hub reuse) | Dashboard |

## 8) Workflow: design before code (mandatory)

Before any implementation PR:

1. Run `staff-product-designer` for the target page(s).
2. Produce a design artifact covering:
   - component extraction (atom/molecule/organism)
   - reuse decisions and ownership mapping
   - required component props and variants
   - interaction states and motion behavior
3. Do not write code until that artifact is approved and recorded here.
4. Implement in this order:
   1. tokens/primitives
   2. shared molecules
   3. organisms
   4. page composition only

## 9) Execution plan (no duplication)

### Phase A — Tokens + base primitives
1. Complete token setup from the base design plan.
2. Add stories for all required color, spacing, typography, and radius tokens.
3. Ensure atom APIs are token-driven.

### Phase B — Shared molecules first
1. Implement `FormField`, `SearchBar`, `NavItem`, `StatCard`, `Badge`, `ProgressBar`.
2. Verify state variants in Storybook.

### Phase C — Page composition pass 1 (dashboard surfaces)
1. Implement `AppHeader`, `AppSidebar` with role variants.
2. Implement `StudentRow`, `LessonCard`, `AssignmentRow`, `ActivityItem`.
3. Compose teacher/guardian/student dashboards.

### Phase D — Communication pass
1. Implement `MessageBubble`, `ThreadPreview`, `NoteCard`, `MessagingThread`, `PracticeNoteThread`.
2. Verify interaction states and thread/message behavior.

### Phase E — Conversion complete + hardening
1. Compose remaining pages: student hub, new student form, messaging inbox.
2. Ensure no orphaned page-only components remain.
3. Run state coverage audit in Storybook.
4. Add/update composition checks and CI gates.

## 10) Implementation guardrails

- Components may only be introduced when lower-level dependencies exist.
- If two pages need similar UI, prefer prop or variant changes before new components.
- Each page must use canonical components from `src/design-system/`.
- Storybook naming should match the component hierarchy for fast duplicate-UI detection.

## 11) How to use `staff-product-designer` on this rollout

Use it page-by-page with prompts like:
- `Use staff-product-designer for teacher dashboard atomic extraction and return only reusable atom/molecule/organism proposals with prop contracts.`
- `Use staff-product-designer to review messaging_inbox for interaction parity and define MessageBubble and MessagingThread states.`
- `Use staff-product-designer to convert new_student_creation_form into existing FormField and Button variants, avoiding new atoms.`

## 12) Deliverables

- One canonical mapping doc in `docs/plans/atomic-implementation/`.
- Updated Storybook map in implementation PRs.
- Zero duplicated atomic implementations across page-level folders.
