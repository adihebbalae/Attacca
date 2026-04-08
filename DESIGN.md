# DESIGN.md — Attacca

> *attacca* (Italian) — proceed to the next movement without pause.
>
> This file describes the Attacca visual design system. AI coding agents read it to generate consistent UI without needing to be told the design system in each prompt. Based on the [Google Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/overview/).

---

## 1. Visual Theme & Atmosphere

**Mood:** Musical precision meets developer tooling. Dark, structured, disciplined.

**Design philosophy:** Like a concert hall stage — all black surfaces, precise geometry, controlled lighting. The space between notes: clean, intentional, resolved. Not playful, not corporate, not sci-fi.

**Visual metaphor:** Musical score notation. Staff lines (━━━), bar lines (│), the double bar line (║) — the notation mark that means "attacca: proceed without pause." Directional flow left → right, like reading a score. Agents are voices in a composition; handoffs are the bar lines between movements.

**Density:** Medium-dense. Developer-oriented. Information visible without excessive scrolling, but never cluttered.

**Tone words:** Precise. Refined. Silent. Architectural. A senior engineer's control plane — not a toy, not a chatbot wrapper.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Musical reference |
|---|---|---|---|
| `--color-bg` | `#0d0d14` | Page/app background | The unlit concert hall |
| `--color-surface` | `#1a1a2e` | Cards, panels, sidebars | Sheet music paper in darkness |
| `--color-surface-raised` | `#252540` | Elevated surfaces, tooltips | Raised music stand |
| `--color-primary` | `#8b7cf6` | Primary accent (violet/purple) | The conductor's podium light |
| `--color-secondary` | `#5ec4d4` | Secondary accent (teal/cyan) | Active voice highlight |
| `--color-tertiary` | `#c4a0f7` | Tertiary (light lavender) | Piano dynamic marking |
| `--color-success` | `#4ade80` | Success, active state (green) | Resolved cadence |
| `--color-warning` | `#f0c050` | Warning, blocked state (amber) | Fermata — hold, pause |
| `--color-error` | `#ef4444` | Error, danger (red) | Sforzando — sudden break |
| `--color-text` | `#e8e8f0` | Primary text | Bright ink on dark paper |
| `--color-text-muted` | `#6a6a8a` | Secondary/muted text | Ghost notes |
| `--color-border` | `#2a2a4a` | Subtle borders and dividers | Staff line |

**Gradients (use sparingly):**
- Primary: `#8b7cf6` → `#5ec4d4` (left to right)
- Background: `#0d0d14` → `#1a1a2e` (subtle, vertical or radial)

**Dark mode only.** There is no light mode. The concert hall is never lit.

---

## 3. Typography Rules

| Role | Font | Size | Weight | Color |
|---|---|---|---|---|
| Display / Hero | Inter or Geist Mono | 40–56px | 600 | `#e8e8f0` |
| H1 | Inter | 28–32px | 600 | `#e8e8f0` |
| H2 | Inter | 22–24px | 600 | `#e8e8f0` |
| H3 | Inter | 18px | 500 | `#e8e8f0` |
| Body | Inter | 14–16px | 400 | `#e8e8f0` |
| Small / Label | Inter | 12px | 400 | `#6a6a8a` |
| Code / Mono | JetBrains Mono or Cascadia Code | 13px | 400 | `#c4a0f7` |
| Status Badge | Inter | 11px | 500 uppercase | varies by state |

**Brand name rule:** *Attacca* is always italic in body text — matching the musical notation convention where performance instructions are set in italics. In logos and headlines, upright is fine.

**Line height:** 1.5 for body, 1.2 for headings.

**Letter spacing:** Default for body; `0.05em` tracking for all-caps labels and badges.

---

## 4. Component Stylings

### Buttons

**Primary:**
- Background: `#8b7cf6` | Text: `#0d0d14` (dark on purple, not white)
- Border: none | Border radius: 6px | Padding: 8px 16px | Font: 14px weight 500
- Hover: `#9d8ff8` | Active: `#7a6be0` | Disabled: opacity 0.4, cursor not-allowed

**Secondary / Ghost:**
- Background: transparent | Border: 1px solid `#2a2a4a` | Text: `#e8e8f0`
- Hover: border `#8b7cf6`, text `#8b7cf6`

**Danger:**
- Background: `#ef4444` | Text: white | Hover: `#dc2626`

### Cards / Panels

- Background: `#1a1a2e` | Border: 1px solid `#2a2a4a` | Border radius: 8px | Padding: 16px
- No drop shadows by default — use border instead
- Selected/active variant: border color `#8b7cf6`

### Status Badges

| State | Background | Text | Use case |
|---|---|---|---|
| Active | `rgba(74,222,128,0.15)` | `#4ade80` | Agent running |
| Blocked | `rgba(240,192,80,0.15)` | `#f0c050` | Waiting / fermata |
| Error | `rgba(239,68,68,0.15)` | `#ef4444` | Failed / broken |
| Idle | `rgba(106,106,138,0.15)` | `#6a6a8a` | Not started |
| Cleared | `rgba(94,196,212,0.15)` | `#5ec4d4` | Security cleared |

Badge: border-radius 6px, padding 4px 8px, 11px uppercase monospace text.

### Agent Flow Diagrams

Flow pattern: `[Agent A] ──║──> [Agent B] ──║──> [Agent C]`

- Agent boxes: `#8b7cf6` border on `#1a1a2e` background, 6px radius
- Connector lines: `#5ec4d4`
- Double bar (║) dividers: `#8b7cf6`
- Arrowheads: `#5ec4d4`
- Label text inside boxes: `#e8e8f0`, Inter 13px

### Code Blocks / Terminal Output

- Background: `#0d0d14` | Border: 1px solid `#2a2a4a` | Border radius: 6px
- Font: JetBrains Mono 13px
- Keywords: `#c4a0f7` | Success output: `#4ade80` | Error output: `#ef4444` | Default: `#e8e8f0`

### Form Inputs

- Background: `#0d0d14` | Border: 1px solid `#2a2a4a` | Border radius: 6px
- Text: `#e8e8f0` | Placeholder: `#6a6a8a`
- Focus: border `#8b7cf6`, box-shadow `0 0 0 2px rgba(139,124,246,0.2)`
- Error: border `#ef4444`

### Navigation / Sidebar

- Background: `#1a1a2e`
- Active item: left border 2px `#8b7cf6`, background `rgba(139,124,246,0.08)`
- Hover item: background `rgba(255,255,255,0.04)`
- Icon color: `#6a6a8a` default → `#8b7cf6` active

### Dividers (Staff Lines)

Horizontal rules should evoke staff lines in a score:
- Color: `#2a2a4a` | Height: 1px
- Section breaks: `rgba(139,124,246,0.08)` for a subtle purple tinge

---

## 5. Layout Principles

**Base unit:** 8px. All spacing in multiples of 8 (4px for micro).

**Spacing scale:**

| Token | Value |
|---|---|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |

**Content max-widths:**
- Marketing / landing: 1200px
- App / dashboard: 960px
- Text-heavy / docs: 680px

**Whitespace philosophy:** Generous. The space between elements breathes like rests in a score. Don't pack elements together. When in doubt, add more space.

**Directional flow:** Left to right, top to bottom — like reading a score. Agent workflows flow left → right. Never right → left.

---

## 6. Depth & Elevation

**No drop shadows.** Use borders instead. Shadows feel soft and rounded — borders feel precise, architectural, score-like.

**Elevation via background lightness:**

| Level | Color | Use |
|---|---|---|
| Base | `#0d0d14` | Page background |
| +1 | `#1a1a2e` | Panels, sidebar |
| +2 | `#252540` | Raised cards, modals |
| +3 | `#2e2e5a` | Tooltips, popovers |

**Focus rings:** `0 0 0 2px rgba(139,124,246,0.4)` — only on interactive elements, never decorative.

---

## 7. Do's and Don'ts

**DO:**
- Dark backgrounds always (`#0d0d14` or `#1a1a2e`)
- Musical notation references: staff lines, bar lines, the double bar (║), directional arrows
- Structured geometry: parallel lines, grids, left-to-right flow
- Purple + teal as the primary accent pair
- Borders over shadows for every elevation decision
- Monospace (`JetBrains Mono`) for all code, file paths, and agent names
- `currentColor` in SVG icons — never hardcode hex in SVG files

**DON'T:**
- Bright or white backgrounds — this is always dark
- Drop shadows (use elevation + border system instead)
- Neon colors or heavy multi-stop gradients
- Animation beyond subtle hover transitions (150ms ease-out max)
- Robot, brain, or neural network iconography
- Musical instruments (no piano keys, treble clefs, guitars, waveforms, DJ decks)
- Comic, decorative, or display fonts
- The word "boilerplate" anywhere in any UI copy

---

## 8. Responsive Behavior

| Breakpoint | Width | Changes |
|---|---|---|
| Mobile | < 640px | Single column. Sidebar collapsed (hamburger or bottom nav). Flow diagrams stack vertically. |
| Tablet | 640–1024px | Sidebar as overlay. Two-column where relevant. |
| Desktop | > 1024px | Full layout. Sidebar pinned. Flow diagrams horizontal. |

**Touch targets:** Minimum 44×44px for all interactive elements on touch devices.

**Agent flow diagrams:** Horizontal on desktop (left → right), vertical stacking on mobile (top → bottom). Both use the same ║ divider visual.

---

## 9. Agent Prompt Guide

Quick reference block for AI agents — paste this into any prompt to get on-brand output:

```
Attacca design system:
Background: #0d0d14 | Surface: #1a1a2e | Raised: #252540
Primary: #8b7cf6 (purple) | Secondary: #5ec4d4 (teal)
Text: #e8e8f0 | Muted: #6a6a8a | Border: #2a2a4a
Success: #4ade80 | Warning: #f0c050 | Error: #ef4444
Font: Inter (UI), JetBrains Mono (code)
Radius: 6px buttons, 8px cards | Spacing: 8px base unit
Rules: always dark, borders not shadows, musical score aesthetic, no playful elements
```

**Ready-to-use component prompts:**

- **Status card:** "Agent status card: `#1a1a2e` background, `#2a2a4a` border, 8px radius, agent name in Inter 14px, status badge with 15% opacity tinted background matching state color."

- **Flow diagram:** "Agent relay diagram: agent boxes outlined `#8b7cf6` on `#1a1a2e`, connected by `#5ec4d4` lines with ║ bar line dividers, left-to-right flow, `#0d0d14` background."

- **Dashboard panel:** "Dashboard panel using Attacca design: dark `#1a1a2e` surface, `#8b7cf6` active accents, Inter font, 8px border radius, status badges with colored tinted backgrounds."

---

*Design system for [Attacca](https://github.com/adihebbalae/Attacca) — multi-agent AI coding orchestrator for VS Code.*
