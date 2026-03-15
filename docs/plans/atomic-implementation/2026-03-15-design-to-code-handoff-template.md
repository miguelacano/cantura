# Design-to-Code Handoff (Atomic Migration)

## 1) Scope
- **Page/Feature:**
- **Mockup source:** (path in `docs/designs/`)
- **Designer skill used:** `staff-product-designer`
- **Date:**

## 2) Decomposition outcome
- **Atoms reused/extended:**
- **Molecules reused/extended:**
- **Organisms reused/extended:**
- **New components proposed (must be justified):**
- **Component ownership updates:**
  - `Icon`:
  - `Button`:
  - `...`

## 3) Reuse decision log
For each requested UI pattern, answer:
- Existing component exists?
- Variant/prop covers this case?
- If yes, document chosen variant/props.
- If no, justify why new component is required.

## 4) State and interaction coverage
- Default:
- Hover:
- Focus:
- Active/selected:
- Disabled:
- Loading:
- Error:
- Empty:

## 5) Accessibility review (high priority)
- **Keyboard accessibility:**
  - Can every actionable control be reached and triggered by keyboard?
- **Focus management:**
  - Is focus visible and logical through tab order?
- **Semantics and labeling:**
  - Are labels/roles/name descriptions present where needed?
- **Color + contrast checks:**
  - Is non-color signaling available for state, if needed?
  - Are text and status colors compliant for WCAG AA?
- **Target size and spacing:**
  - Are interactive targets large enough and not too dense?
- **Motion accessibility:**
  - Is reduced-motion behavior defined and equivalent for each animation?
- **Assistive compatibility blockers:**
  - List any remaining blockers and owner/date for fix.
- **Priority:**
  - [ ] Blocker  
  - [ ] Medium  
  - [ ] Acceptable

## 6) Motion and spacing review
- Motion behavior added/updated:
- Timing/easing tokens used:
- Micro-interaction points (tap/hover/transition):
- Reduced-motion handling verified:

## 7) Mapping updates required
- Pages mapped to canonical components:
- Orphan risk checks (new per-page-only UI detected?):
- Mapping file to edit:
  - `docs/plans/atomic-implementation/2026-03-15-atomic-page-to-atomic-mapping.md`

## 8) Implementation plan (in order)
- [ ] Step 1: tokens/primitives updates
- [ ] Step 2: molecule/organism implementation
- [ ] Step 3: compose page with shared components only
- [ ] Step 4: story/interaction verification
- [ ] Step 5: cleanup duplicate patterns / remove one-off variants

## 9) Approval checkpoint
- Designer review approved by:
- Date:

## 10) Go/no-go for code
- **GO** / **NO-GO**
- Blocking issues (if NO-GO):
- Fix plan before implementation:

## 11) Accessibility gate for code handoff
- Final accessibility status:
  - [ ] Pass
  - [ ] Needs fixes before coding
- Required evidence:
  - [ ] focus order walkthrough
  - [ ] contrast/signal checks
  - [ ] reduced-motion parity notes
  - [ ] keyboard and label verification summary
