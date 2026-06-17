# Design System Upgrade Plan

> We are upgrading the Metalyde design system's **structural completeness** — adding a named type scale, semantic elevation tokens, workflow status-pill tokens, numeric table conventions, a focus halo, composite KPI/chart/command-palette components, and written doctrine — without touching our locked Swiss-Control-Room visual identity (red-orange `#e63000` accent, paper/ink canvas, near-square 2px radius, Bricolage Grotesque). The guiding principle: adopt the *systematic structure* of a premium SaaS reference design; translate every structural pattern into our own palette, never its look.

---

## 1. Posture — what we keep, borrow, and refuse

| Posture | What | Rationale |
|---------|------|-----------|
| **KEEP** | Red-orange `#e63000`/`#ff6a3d` accent · paper `#f5f5f0` / ink `#1a1a1a` canvas · near-square `--radius: 0.125rem` scale · Bricolage Grotesque display · `--ease-control` spring easing · existing `--chart-1..5` ramp · full sidebar token set | These are the locked brand identity — Swiss Control Room is a deliberate aesthetic opposite of warm-soft; changing any of them breaks the brand. |
| **BORROW** | Named type scale (sizes/weights/LH/tracking) · two-layer CSS token architecture (semantic vars → `@theme inline`) · status-pill triple (`--status-{name}` + `-fg` + `-dot`) · shadow step names as semantic tokens · `elevated` surface tier · `data-numeric` / `.tabular-nums` table convention · `KpiMetric` type + `KpiCard` anatomy · `chart-utils.ts` SVG primitives · `StatusBadge` discriminated-union adapter · `PageHeader` universal primitive · written design doctrine | All are brand-neutral structural patterns — they carry zero visual identity of the source. The value is in the architecture, not the colors. |
| **REFUSE** | Terracotta `#C2562F` · Fraunces serif display · warm-tinted shadows (amber/sepia tint) · generous `14px` base radius · "warm-soft-premium" shadow treatment · any agency-OS product scope (clients / campaigns / retainers / invoices) until the product explicitly targets that vertical | Adopting these would directly contradict the locked brand and/or scope creep into unbuilt product territory. |

---

## 2. Token-architecture gaps (highest leverage, brand-neutral)

### 2.1 Named type scale

**Gap:** `packages/ui/src/theme.css` has `--font-display` and `--font-mono` family vars, but zero size/weight/line-height/tracking tokens. `ThemeTypography` in `lib/theme.ts:33-36` carries only `fontFamily` + `baseFontSize`. All type hierarchy is ad-hoc Tailwind utilities scattered in component `className` strings.

**Pattern to adopt:** Define a named scale (`display / h1 / h2 / h3 / h4 / body / body-sm / small / caption / label / mono-kpi`) as CSS custom properties, each covering the four axes: `font-size`, `font-weight`, `line-height`, `letter-spacing`. Tailwind utilities remain for overrides; these tokens are the canonical source of truth.

**Concrete proposal — add to `:root` in `theme.css` and forward in `@theme inline`:**

```css
/* ── Type scale — Swiss Control Room ── */
/* Display: Bricolage Grotesque, used for hero h1 and KPI values */
--text-display-size:    3rem;       /* 48px */
--text-display-weight:  560;
--text-display-lh:      1.05;
--text-display-ls:      -0.03em;

--text-h1-size:         2rem;       /* 32px */
--text-h1-weight:       600;
--text-h1-lh:           1.1;
--text-h1-ls:           -0.02em;

--text-h2-size:         1.5rem;     /* 24px */
--text-h2-weight:       600;
--text-h2-lh:           1.2;
--text-h2-ls:           -0.015em;

--text-h3-size:         1.125rem;   /* 18px */
--text-h3-weight:       600;
--text-h3-lh:           1.3;
--text-h3-ls:           -0.01em;

--text-h4-size:         0.9375rem;  /* 15px */
--text-h4-weight:       500;
--text-h4-lh:           1.4;
--text-h4-ls:           -0.005em;

--text-body-size:       0.875rem;   /* 14px */
--text-body-weight:     400;
--text-body-lh:         1.5;
--text-body-ls:         0;

--text-body-sm-size:    0.8125rem;  /* 13px */
--text-body-sm-weight:  400;
--text-body-sm-lh:      1.5;
--text-body-sm-ls:      0;

--text-small-size:      0.75rem;    /* 12px */
--text-small-weight:    400;
--text-small-lh:        1.4;
--text-small-ls:        0.01em;

--text-caption-size:    0.6875rem;  /* 11px */
--text-caption-weight:  400;
--text-caption-lh:      1.4;
--text-caption-ls:      0.02em;

--text-label-size:      0.75rem;    /* 12px */
--text-label-weight:    500;
--text-label-lh:        1.3;
--text-label-ls:        0.04em;     /* uppercase optical spacing */

/* mono-kpi: mono stack, used for dashboard metric values */
--text-mono-kpi-size:   1.75rem;    /* 28px */
--text-mono-kpi-weight: 500;
--text-mono-kpi-lh:     1.0;
--text-mono-kpi-ls:     -0.02em;
--text-mono-kpi-family: var(--font-mono);
--text-mono-kpi-variant: tabular-nums;
```

**Effort:** S — pure CSS additions, zero component churn.

---

### 2.2 Named shadow / elevation scale

**Gap:** `SHADOW_PRESETS` in `lib/theme.ts:64-93` overrides Tailwind shadow utilities at runtime via preset strings (`subtle / medium / strong / none`). There are no semantic CSS custom property names (`--shadow-card`, `--shadow-popover`, etc.) — components that want a specific shadow elevation must pick an arbitrary Tailwind class or hard-code a value.

**Pattern to adopt:** Expose a five-step shadow scale as CSS vars that components can reference by role, not by visual intensity. Forward them in `@theme inline` so they become Tailwind `shadow-*` utilities.

**Concrete proposal — add to `:root` in `theme.css`:**

```css
/* ── Shadow scale — crisp, no warm tint (control-room) ── */
--shadow-xs:  0 1px 1px 0 rgb(0 0 0 / 0.04);
--shadow-sm:  0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.04);
--shadow-md:  0 4px 8px -2px rgb(0 0 0 / 0.09), 0 2px 4px -2px rgb(0 0 0 / 0.05);
--shadow-lg:  0 8px 24px -4px rgb(0 0 0 / 0.11), 0 4px 8px -4px rgb(0 0 0 / 0.06);
--shadow-xl:  0 20px 48px -8px rgb(0 0 0 / 0.14), 0 8px 16px -8px rgb(0 0 0 / 0.08);

/* ── Semantic elevation names (components reference these, not the steps directly) ── */
--shadow-card:     var(--shadow-sm);
--shadow-popover:  var(--shadow-md);
--shadow-elevated: var(--shadow-lg);
--shadow-modal:    var(--shadow-xl);
```

```css
/* In .dark — slightly deeper (less ambient light perception) */
.dark {
  --shadow-xs:  0 1px 1px 0 rgb(0 0 0 / 0.12);
  --shadow-sm:  0 1px 3px 0 rgb(0 0 0 / 0.18), 0 1px 2px -1px rgb(0 0 0 / 0.12);
  --shadow-md:  0 4px 8px -2px rgb(0 0 0 / 0.24), 0 2px 4px -2px rgb(0 0 0 / 0.14);
  --shadow-lg:  0 8px 24px -4px rgb(0 0 0 / 0.30), 0 4px 8px -4px rgb(0 0 0 / 0.16);
  --shadow-xl:  0 20px 48px -8px rgb(0 0 0 / 0.38), 0 8px 16px -8px rgb(0 0 0 / 0.20);
}
```

```css
/* In @theme inline — expose as Tailwind utilities */
--shadow-xs:       var(--shadow-xs);
--shadow-sm:       var(--shadow-sm);
--shadow-md:       var(--shadow-md);
--shadow-lg:       var(--shadow-lg);
--shadow-xl:       var(--shadow-xl);
--shadow-card:     var(--shadow-card);
--shadow-popover:  var(--shadow-popover);
--shadow-elevated: var(--shadow-elevated);
--shadow-modal:    var(--shadow-modal);
```

**Effort:** S — additive CSS, remove `SHADOW_PRESETS` runtime override in `lib/theme.ts` separately (tech debt task).

---

### 2.3 Elevated surface token

**Gap:** `--card: #ffffff` and `--popover: #ffffff` are identical in light mode (`theme.css:12,14`). In dark: both `#1c1c1a` (`theme.css:81,83`). `lib/theme.ts:376-379` copies `card` and `popover` from `background`. There is no distinct third surface tier for menus, drawers, or floating panels that sit above cards.

**Pattern to adopt:** A third surface tier (`--elevated`) that is slightly lighter than `--card` in light mode and slightly lighter than `--card` in dark mode, creating a perceptible depth step without relying solely on shadow.

**Concrete proposal — add to `:root` and `.dark` in `theme.css`:**

```css
/* ── Elevated surface (floating menus, sheets, command palette) ── */
/* Light: pure white is already card; elevated = same white, shadow carries the depth */
--elevated: #ffffff;
--elevated-foreground: #1a1a1a;

/* Dark: one stop lighter than --card (#1c1c1a) */
.dark {
  --elevated: #242422;
  --elevated-foreground: #f5f5f0;
}
```

```css
/* In @theme inline */
--color-elevated: var(--elevated);
--color-elevated-foreground: var(--elevated-foreground);
```

> Note: In light mode the visual differentiation comes from `--shadow-elevated` (shadow-lg), not the surface color itself — pure white on paper is already the highest contrast surface. The token still exists for components to reference canonically.

**Effort:** S — two var additions + forward. Update `lib/theme.ts` to include `elevated` in the derivation map.

---

### 2.4 Status-pill token system (9 workflow statuses)

**Gap:** `theme.css:37-44` has four generic semantic pairs: `destructive / success / warning / info`. No `--status-{name}` triples exist. The per-feature `StatusBadge` in `apps/web/src/routes/settings/api-keys/-components/status-badge.tsx:8-22` uses hardcoded `bg-green-100 text-green-800` etc. — not token-driven, not in `@repo/ui`.

**Pattern to adopt:** Define `--status-{name}` (background), `--status-{name}-fg` (text), `--status-{name}-dot` (indicator dot color) for each workflow status. All three sub-elements of a status pill resolve from one token family. Add new status = add 3 vars.

**Workflow statuses for Metalyde's agency-OS context (when built):** `draft | planned | active | review | ontrack | risk | blocked | done | archived`. Map onto our existing semantic hues:

**Concrete proposal — add to `:root` in `theme.css`:**

```css
/* ── Status-pill tokens — 9 statuses × 3 sub-tokens ── */
/* bg = tinted surface at 12-15% opacity; fg = legible on bg; dot = saturated indicator */

/* draft — muted/neutral (ink at low opacity) */
--status-draft:        rgb(26 26 26 / 0.08);
--status-draft-fg:     #555550;
--status-draft-dot:    #888880;

/* planned — info blue, muted */
--status-planned:      oklch(0.55 0.2 250 / 0.12);
--status-planned-fg:   oklch(0.35 0.18 250);
--status-planned-dot:  oklch(0.55 0.2 250);

/* active — brand red-orange, low opacity bg */
--status-active:       rgb(230 48 0 / 0.10);
--status-active-fg:    #b82600;
--status-active-dot:   #e63000;

/* review — warning amber */
--status-review:       oklch(0.75 0.18 85 / 0.14);
--status-review-fg:    oklch(0.40 0.14 85);
--status-review-dot:   oklch(0.65 0.18 85);

/* ontrack — success green */
--status-ontrack:      oklch(0.55 0.2 145 / 0.12);
--status-ontrack-fg:   oklch(0.32 0.16 145);
--status-ontrack-dot:  oklch(0.55 0.2 145);

/* risk — warning but more saturated */
--status-risk:         oklch(0.75 0.18 65 / 0.14);
--status-risk-fg:      oklch(0.38 0.16 60);
--status-risk-dot:     oklch(0.60 0.20 60);

/* blocked — destructive red */
--status-blocked:      oklch(0.577 0.245 27.325 / 0.12);
--status-blocked-fg:   oklch(0.40 0.20 27);
--status-blocked-dot:  oklch(0.577 0.245 27.325);

/* done — success green, desaturated */
--status-done:         oklch(0.55 0.12 145 / 0.10);
--status-done-fg:      oklch(0.35 0.10 145);
--status-done-dot:     oklch(0.55 0.12 145);

/* archived — fully muted */
--status-archived:     rgb(26 26 26 / 0.05);
--status-archived-fg:  #a8a89e;
--status-archived-dot: #b4b1a8;
```

```css
/* .dark overrides — increase opacity slightly for legibility on dark surfaces */
.dark {
  --status-draft:       rgb(245 245 240 / 0.08);
  --status-draft-fg:    #a8a89e;
  --status-draft-dot:   #888880;

  --status-planned:     oklch(0.65 0.2 250 / 0.15);
  --status-planned-fg:  oklch(0.75 0.18 250);
  --status-planned-dot: oklch(0.65 0.2 250);

  --status-active:      rgb(255 106 61 / 0.15);
  --status-active-fg:   #ff6a3d;
  --status-active-dot:  #ff6a3d;

  --status-review:      oklch(0.70 0.15 85 / 0.16);
  --status-review-fg:   oklch(0.82 0.15 85);
  --status-review-dot:  oklch(0.70 0.15 85);

  --status-ontrack:     oklch(0.65 0.2 145 / 0.14);
  --status-ontrack-fg:  oklch(0.78 0.18 145);
  --status-ontrack-dot: oklch(0.65 0.2 145);

  --status-risk:        oklch(0.60 0.20 60 / 0.16);
  --status-risk-fg:     oklch(0.80 0.18 60);
  --status-risk-dot:    oklch(0.60 0.20 60);

  --status-blocked:     oklch(0.704 0.191 22.216 / 0.16);
  --status-blocked-fg:  oklch(0.82 0.18 22);
  --status-blocked-dot: oklch(0.704 0.191 22.216);

  --status-done:        oklch(0.65 0.12 145 / 0.12);
  --status-done-fg:     oklch(0.78 0.10 145);
  --status-done-dot:    oklch(0.65 0.12 145);

  --status-archived:    rgb(245 245 240 / 0.04);
  --status-archived-fg: #636360;
  --status-archived-dot: #636360;
}
```

**Effort:** S (token additions only) + M (promote `StatusBadge` to `@repo/ui` consuming these tokens, add discriminated-union adapter).

---

### 2.5 Focus-ring halo

**Gap:** `theme.css:197` applies `outline-ring/50` globally. `Button.tsx:9` and `Badge.tsx:8` use `focus-visible:ring-ring/50 focus-visible:ring-[3px]` — a single ring at 50% opacity. No secondary soft outer glow. The ring color `--ring: #e63000` is correct (brand); the treatment is minimal.

**Pattern to adopt:** Add a faint outer shadow halo that grows from the ring color, creating a two-layer focus indicator: the crisp `3px` ring + a diffuse `0 0 0 6px` outer glow at low opacity. This lifts WCAG 2.2 focus visibility without changing the aesthetic.

**Concrete proposal — add to `:root` in `theme.css`:**

```css
/* ── Focus halo — outer diffuse glow from brand ring color ── */
--focus-halo: 0 0 0 6px rgb(230 48 0 / 0.12);   /* light: red-orange at 12% */
```

```css
/* .dark */
.dark {
  --focus-halo: 0 0 0 6px rgb(255 106 61 / 0.14);
}
```

```css
/* In @theme inline */
--shadow-focus-halo: var(--focus-halo);
```

Apply in `Button.tsx` by augmenting the `focus-visible:` cluster:

```tsx
// Before (Button.tsx:9)
'focus-visible:ring-ring/50 focus-visible:ring-[3px]'

// After — add shadow-[var(--focus-halo)] via Tailwind arbitrary value
'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:shadow-[var(--focus-halo)]'
```

Extend to `Input.tsx`, `Select.tsx`, `Textarea.tsx`, `Checkbox.tsx` using the same pattern.

**Effort:** S — two token additions + string change in ~6 component files.

---

### 2.6 Numeric / tabular convention

**Gap:** `packages/ui/src/components/Table.tsx:67-77` — `TableCell` is generic `p-2 align-middle`. No `.tabular-nums`, `text-right`, `font-mono`, or `data-numeric` attribute handling. Per Report A, no `font-variant-numeric` utility or `[data-numeric]` selector exists anywhere in `packages/ui/src/`.

**Pattern to adopt:** CSS attribute-selector automation: `[data-numeric]` on `<th>` or `<td>` triggers right-align + `tabular-nums` automatically. Also expose a `--font-tabular` alias for inline use.

**Concrete proposal — add to `theme.css` `@layer base`:**

```css
@layer base {
  /* Numeric column convention: add data-numeric to <th>/<td> to opt in */
  [data-numeric] {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  /* For inline use on any element (KPI values, money, counters) */
  .tabular {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
    font-family: var(--font-mono);
  }
}
```

Update `TableHead` and `TableCell` in `packages/ui/src/components/Table.tsx` to include the CSS attribute selectors in their `cn()` base:

```tsx
// TableHead — add auto right-align when numeric
'text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([data-numeric])]:text-right [&[data-numeric]]:text-right ...'

// TableCell — add auto right-align + tabular when numeric
'p-2 align-middle [&[data-numeric]]:text-right [&[data-numeric]]:tabular-nums [&[data-numeric]]:font-mono ...'
```

**Effort:** S — one `@layer base` block + two `cn()` string updates in `Table.tsx`.

---

## 3. Component conventions to adopt

| Component | Our status | What to build | Location in monorepo | Effort |
|-----------|-----------|---------------|----------------------|--------|
| **KPI stat-card** (label + mono-kpi value + delta pill + sparkline) | Absent — `StatCounter` is landing-page-only (Report B §6); no delta/trend, no card wrapper, no sparkline | `KpiCard` component: `KpiMetric` type (`label, value, format: 'money'|'percent'|'hours'|'number', delta?, invertDelta?, spark?: number[]`) → renders label in `--text-label` scale, value in `--text-mono-kpi` scale, `StatTrend` delta pill (bg-success/12 or bg-destructive/12 with arrow + %), optional inline sparkline bleeding to card edges | `packages/ui/src/components/KpiCard.tsx` | M |
| **Status pill with dot** (bg-tint + colored dot + label) | Partial — `Badge` has 4 variants (Report B §2), per-feature `StatusBadge` in `apps/web/src/routes/settings/api-keys/-components/status-badge.tsx` uses hardcoded Tailwind colors, no dot slot, not in `@repo/ui` | Extend `Badge` with a `tone` prop path: when `tone` is set, CVA is bypassed and `--status-{tone}` / `--status-{tone}-fg` / `--status-{tone}-dot` tokens are applied directly. `dot` sub-element rendered as `<span>` inside badge. Add `StatusBadge` discriminated-union adapter routing `{ kind: 'api-key' \| ... ; value }` → `{ tone, label }` | `packages/ui/src/components/Badge.tsx` (extend) + `packages/ui/src/components/StatusBadge.tsx` (new adapter) | M |
| **SVG chart set** (area, line, bar, donut, sparkline) | Absent — zero charting library, no `recharts`/`d3`/`visx` in `packages/` or `apps/` (Report B §5) | Port `chart-utils.ts` primitives (`linearScale`, `niceTicks`, `buildLinePath`, `buildAreaPath`, `donutArcPath`, `nearestIndex`, `chartColorVar`) verbatim. Build `AreaChart`, `BarChart`, `DonutChart`, `Sparkline` as hand-rolled SVG components consuming `--color-chart-1..5` tokens. `prefers-reduced-motion` guard on all draw animations. `ChartValueFormat = 'money' \| 'number' \| 'percent'` shared with `KpiCard`. Defer `HeatmapChart` + `GanttChart` to product phase. | `packages/ui/src/lib/chart-utils.ts` (new) + `packages/ui/src/components/charts/` folder | L |
| **Command palette (⌘K)** | Absent — no `cmdk`, no `CommandPalette` anywhere (Report B §5) | Add `cmdk` dependency to `packages/ui`. Build `CommandPalette` using `cmdk` primitives, styled to `--elevated` surface + `--shadow-modal` + brand ring focus. Global `⌘K` / `Ctrl+K` keybinding via `useCommandPalette` hook. Groups: navigation, settings, actions. | `packages/ui/src/components/CommandPalette.tsx` + hook in `packages/ui/src/lib/use-command-palette.ts` | M |
| **App-shell primitives** (composable sidebar + topbar + breadcrumb) | Partial — `Header.tsx` (topbar) + `admin.tsx` `AdminDesktopSidebar` exist but are product-coupled, not in `@repo/ui` (Report B §5) | Extract `<AppShell>`, `<AppSidebar>` (248px, grouped nav, active accent bar using `--brand`), `<AppTopbar>` (56px, `⌘K` slot + search slot + user menu slot) as generic `@repo/ui` primitives. Add `<Breadcrumb>` / `<BreadcrumbItem>` following semantic `<nav aria-label="breadcrumb">` anatomy. Current app-specific implementations become thin wrappers over these primitives. | `packages/ui/src/components/AppShell.tsx` + `AppSidebar.tsx` + `AppTopbar.tsx` + `Breadcrumb.tsx` | M |
| **Per-route loading skeletons** | Partial — `Skeleton` primitive exists (`packages/ui/src/components/Skeleton.tsx` — `bg-accent animate-pulse rounded-md`). Dashboard uses inline `animate-pulse` divs directly, not `<Skeleton>` (Report B §5, Report C §5). Admin/audit-logs has `AuditLogsSkeleton` as a one-off. | Establish the convention: every route with async data MUST have a co-located `<RouteName>Skeleton` built from `<Skeleton>` primitives. Document the pattern in `docs/standards/frontend-patterns.mdx` (not as a new component but as a layout contract). Optionally add `SkeletonCard`, `SkeletonTable` composed helpers to `@repo/ui` for the most common shapes. | `packages/ui/src/components/SkeletonCard.tsx`, `SkeletonTable.tsx` (new helpers) | S |
| **Empty-state convention** | Present — `EmptyState` in `@repo/ui` has 3 variants (`default`/`error`/`search`), icon/title/description/action props (Report B §5). Good foundation, inconsistently applied. | No new component needed. Enforce via code review standard: any route with `data.length === 0` branch must use `<EmptyState>`. Add a `hint` prop for contextual "what to do next" text. Document WCAG requirement that empty states have a visible focus target (the action button). | `packages/ui/src/components/EmptyState.tsx` (add `hint` prop) + `docs/standards/frontend-patterns.mdx` | S |
| **`PageHeader` universal primitive** | Absent — page headers are assembled ad-hoc per route (`h1` + description + action buttons inline in each route component) | `<PageHeader title description actions>` — stack on mobile, row on `sm+`, `min-w-0` on text block, `shrink-0` on actions, `h1` uses `--font-display` + `--text-h1-*` scale. Used at the top of every non-dashboard route. | `packages/ui/src/components/PageHeader.tsx` | S |

---

## 4. Process artifacts worth copying (not code)

These are documents that enforce system-wide consistency. Recommend authoring in `docs/standards/` alongside the existing `frontend-patterns.mdx`, `backend-patterns.mdx`, `code-review.mdx`.

| Artifact | Where | Scope |
|----------|-------|-------|
| **`docs/standards/design-doctrine.mdx`** | `docs/standards/` | Written design constitution: ≤7 colors at any time, 1 accent (`--brand`), ≤3 font roles (display/sans/mono), motion is punctuation (use `--duration-fast` 150ms by default — `--duration-normal` 300ms only for layout shifts, `--duration-slow` 700ms only for page transitions), radius is near-square and non-negotiable, WCAG AA contrast ratios documented per surface pair. This is the "why" document — prevents drift when new contributors add components. |
| **`docs/standards/component-spec.mdx`** | `docs/standards/` | Per-component anatomy table: which token each visual element maps to (e.g., `Card.default` background → `--card`, shadow → `--shadow-card`, radius → `--radius-lg`). Defines the required state coverage (default / hover / focus / disabled / loading / error) for every interactive component. |
| **WCAG contrast ratios table** | Inline in `design-doctrine.mdx` or as a `docs/standards/accessibility.mdx` subsection | Document the actual contrast ratio for every text-on-surface combination we ship: `--foreground` on `--background` (ink/paper), `--muted-foreground` on `--background`, `--brand-foreground` on `--brand`, `--status-*-fg` on `--status-*` for all 9 statuses. Run once with a contrast checker tool; paste results. Prevents future "did anyone check this?" questions. |
| **`docs/standards/ia-route-map.mdx`** | `docs/standards/` | The canonical URL shape and route tree for the app. Defines: flat noun-plural URL convention (`/clients`, `/campaigns`), dashboard-as-health-check doctrine (read-only summary, no deep nav), entity detail via route param, view-mode toggle (table vs board) at entity level. Currently implicit — making it explicit prevents ad-hoc URL decisions. |

---

## 5. Optional — product/IA ideas (only if we'd ever go vertical)

> OPTIONAL / SPECULATIVE — Metalyde is currently pre-feature (Report C §3: zero agency-OS routes exist). These apply only if the product targets an agency delivery vertical.

- The `client → campaign → task → time_entry` entity graph with `agency_id` FK + Postgres RLS on every table is a proven multi-tenant data model; adopt it verbatim from the reference design's DB conventions (nanoid PKs, epoch-ms timestamps, cents-as-integer money, `archived_at` soft-delete, rate snapshots on time entries).
- Derived-only metrics (labor cost, billable value, blended margin %, utilization %) should never be stored — always computed at read time. This avoids denormalization bugs when member rates change retroactively.
- The fractional-index `board_order real` column + `@dnd-kit` pattern for kanban ordering is copy-paste ready if a task board is built; zero schema migration on reorder.
- The per-route triad (skeleton → empty state → error state) is already partially present in our admin routes (`/admin/audit-logs`, `/settings/api-keys`); it should become a mandatory gate for every data-bound route in any future agency feature.

---

## 6. Phased adoption roadmap

### P1 — Token completeness (highest leverage, zero component risk)

All tasks are additive CSS/TS changes. Can be one `/dev` issue per bullet.

- **[S]** Add named type scale (§2.1) to `packages/ui/src/theme.css` `:root` block + forward 11 scale entries in `@theme inline`. Update `lib/theme.ts` `ThemeTypography` to include scale tokens.
- **[S]** Add 5-step shadow scale + 4 semantic elevation names (§2.2) to `theme.css` `:root` and `.dark` + forward in `@theme inline`. Remove `SHADOW_PRESETS` runtime override from `lib/theme.ts` (separate cleanup commit).
- **[S]** Add `--elevated` / `--elevated-foreground` surface token (§2.3) to `theme.css` + `lib/theme.ts` derivation map.
- **[S]** Add 27 status-pill tokens (9 statuses × 3 sub-tokens) to `theme.css` `:root` and `.dark` (§2.4). No component changes in this phase.
- **[S]** Add `--focus-halo` token (§2.5) to `theme.css`; apply to `Button.tsx`, `Input.tsx`, `Select.tsx`, `Textarea.tsx`, `Checkbox.tsx` (6 files, string addition only).
- **[S]** Add `[data-numeric]` + `.tabular` CSS selectors to `theme.css` `@layer base`; update `TableHead` and `TableCell` in `Table.tsx` (§2.6).

### P2 — Component library (build in priority order)

- **[S]** `PageHeader.tsx` in `packages/ui/src/components/` — highest reuse, lowest complexity. Wire up `--text-h1-*` scale and `--font-display`.
- **[S]** `SkeletonCard.tsx` + `SkeletonTable.tsx` helpers in `packages/ui/src/components/` — composed from existing `Skeleton` primitive.
- **[S]** `EmptyState.tsx` — add `hint` prop; audit 3 routes where it is not yet applied (`/dashboard` no-org case, `/changelog`, stub org routes) and add it.
- **[M]** `Badge` tone extension + `StatusBadge` adapter (§3, row 2) — extend `Badge.tsx` to support `tone` prop consuming `--status-*` tokens; new `StatusBadge.tsx` with discriminated union; promote and replace per-feature `status-badge.tsx` in `apps/web/src/routes/settings/api-keys/`.
- **[M]** `KpiCard.tsx` + `StatTrend` sub-component in `packages/ui/src/components/` — define `KpiMetric` type in `packages/types/src/`, implement `formatValue()` utility, wire `--text-mono-kpi-*` scale and `--shadow-card` token.
- **[M]** `Breadcrumb.tsx` in `packages/ui/src/components/` — semantic `<nav aria-label="breadcrumb">` + `BreadcrumbItem` + separator. No app-shell extraction yet.
- **[M]** `CommandPalette.tsx` — add `cmdk` to `packages/ui/package.json`; build palette component on `--elevated` surface with `--shadow-modal`; add `useCommandPalette` hook; wire `⌘K` in `apps/web/src/router.tsx`.
- **[M]** `AppShell.tsx` / `AppSidebar.tsx` / `AppTopbar.tsx` — extract from `apps/web/src/routes/admin.tsx` (`AdminDesktopSidebar`) and `apps/web/src/components/Header.tsx`; parameterize nav groups and action slots; replace product-coupled implementations with primitives.
- **[L]** SVG chart set — `packages/ui/src/lib/chart-utils.ts` + `packages/ui/src/components/charts/{AreaChart,BarChart,DonutChart,Sparkline}.tsx`. Implement `prefers-reduced-motion` guards and `--color-chart-1..5` token wiring. `KpiCard` sparkline prop wires to `Sparkline` component once both exist.

### P3 — Documentation and process artifacts

- **[S]** Author `docs/standards/design-doctrine.mdx` — design constitution (≤7 colors, 1 accent, ≤3 fonts, motion rules, radius non-negotiability, WCAG AA table). Link from `docs/standards/index.mdx`.
- **[S]** Author `docs/standards/component-spec.mdx` — anatomy tables for all `@repo/ui` components (which token maps to which visual element, required state coverage checklist).
- **[S]** Add WCAG contrast ratios section — run `--foreground`/`--background`, `--muted-foreground`/`--background`, `--brand-foreground`/`--brand`, and all 9 `--status-*-fg`/`--status-*` pairs through a contrast checker; paste results into `design-doctrine.mdx` or a dedicated `docs/standards/accessibility.mdx`.
- **[S]** Author `docs/standards/ia-route-map.mdx` — canonical URL shape, dashboard-as-health-check doctrine, view-mode toggle convention.
- **[S]** Update `docs/standards/frontend-patterns.mdx` — add per-route skeleton/empty-state/error-state triad as a mandatory gate; document `data-numeric` table convention; document `PageHeader` usage.
