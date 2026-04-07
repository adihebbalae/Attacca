# Attacca — Visual Asset Generation Brief

> *attacca* (Italian, musical direction) — "proceed to the next movement without pause."

Paste this entire document into Claude, nanobanana, or your preferred AI image/design tool to generate all visual assets for the Attacca VS Code extension.

---

## Product Summary

**Name:** Attacca  
**Tagline:** Proceed without pause.  
**One-liner:** Multi-agent AI coding orchestrator for VS Code — one command sets up a Manager → Engineer → Security agent system with a live dashboard and seamless handoffs between movements.  
**Origin:** The musical term *attacca* is written in a score between movements to instruct performers: "do not stop, proceed immediately to the next section." In this product, agents finish their work, write a structured handoff, and the next agent begins without pause. The handoff IS the product.  
**Tone:** Musical precision meets developer tooling. Dark, structured, disciplined. Like a concert hall stage — all black surfaces, precise geometry, controlled lighting. Not playful, not corporate, not sci-fi. Think: the space between notes — clean, intentional, resolved.  
**Audience:** Software engineers who use GitHub Copilot, Cursor, Claude Code, or other AI coding tools and want structured orchestration for multi-agent workflows.

---

## Brand Identity

### The Visual Metaphor
The brand visual language draws from **musical notation and score layout** — not instruments, not waveforms, not DJ decks. We're referencing the *written architecture of music*:
- Staff lines (parallel horizontal lines)
- Bar lines (vertical dividers between sections)
- The double bar line (║) — the notation mark that means "attacca, proceed without pause"
- Directional flow — left to right, sequential, like reading a score
- Nodes connected by lines — agents as voices in a composition

### The Mark
The logo concept is a **stylized double bar line (║)** — the notation symbol that signals "attacca." It should feel like it belongs on a sheet of music AND on a developer's toolbar. Two vertical parallel lines, slightly weighted, possibly with a subtle forward-motion element (an arrow integrated into the right bar, or a slight slant suggesting movement).

Alternative: A minimal **relay baton / conducting gesture** — two connected nodes with a directional line between them, representing the handoff.

---

## Color Palette

| Role | Color | Musical reference |
|---|---|---|
| Background | `#0d0d14` (near-black, concert-dark) | The unlit concert hall |
| Surface / Card | `#1a1a2e` | Sheet music paper in darkness |
| Primary accent | `#8b7cf6` (soft violet/purple) | The conductor's podium light |
| Secondary accent | `#5ec4d4` (teal/cyan) | Active voice highlight |
| Tertiary | `#c4a0f7` (light lavender) | Piano dynamic marking |
| Success / active | `#4ade80` (green) | Resolved cadence |
| Warning / blocked | `#f0c050` (amber) | Fermata — hold, pause |
| Danger / error | `#ef4444` (red) | Sforzando — sudden break |
| Text primary | `#e8e8f0` | Bright ink on dark paper |
| Text muted | `#6a6a8a` | Ghost notes |

### Gradients (use sparingly)
- Primary gradient: `#8b7cf6` → `#5ec4d4` (left to right)
- Background gradient: `#0d0d14` → `#1a1a2e` (subtle, vertical or radial)

---

## Typography

- **Headlines:** Inter or Geist Mono (semi-bold, 600). Clean, geometric, developer-native.
- **Body:** Inter (regular, 400)
- **Code / monospace:** JetBrains Mono or Cascadia Code
- **The word "Attacca"** should always be set in italic when used as a brand name in body text — matching musical notation convention where performance instructions are always in italics. In logos/headlines, upright is fine.

---

## Asset 1: Extension Icon (REQUIRED)

**File:** `icon.png`  
**Size:** 128×128 px, PNG  
**Also needed:** 256×256 px retina version (`icon@2x.png`)  

**Concept:** A stylized double bar line — the notation mark that means "attacca, go straight to the next movement." Two parallel vertical bars, slightly weighted, centered on a dark background.

**Detailed description:**
- Background: `#0d0d14` (solid dark)
- Center element: Two vertical parallel lines in `#8b7cf6` (primary purple), separated by a small gap. Each bar ~3px wide at 128px scale, gap ~4px. Height occupies about 60% of the icon vertically.
- Subtle motion element: A thin horizontal line or arrow extending from the right bar toward the right edge at mid-height, in `#5ec4d4` at 60% opacity — suggesting "proceed forward"
- Optional: Very subtle glow behind the bars in `#8b7cf6` at 15% opacity, soft radial
- No text, no wordmark, no border. VS Code clips activity bar icons to their shape — keep simple.

**Alternative concept (if double bars feel too abstract):** Two connected nodes — left node solid `#8b7cf6`, right node solid `#5ec4d4`, connected by a thin line with an arrowhead pointing right. Like a baton being passed. The handoff, visualized.

**Style:** Vector-clean, minimal, dark-native. Should look at home next to the Copilot icon and GitLens icon in the activity bar. Not a robot, not a brain, not a music note.

---

## Asset 2: Activity Bar Icon (SVG)

**File:** `icon.svg`  
**Size:** 24×24 viewBox, SVG  
**Use:** VS Code activity bar (rendered ~16px, monochrome via `currentColor`)

**Design:** Same double-bar-line concept, simplified for 16px rendering.

```
Two vertical parallel lines, centered. Thin horizontal connector or arrow at mid-height pointing right.
```

Must use only `currentColor` — no hardcoded hex values — so VS Code themes it automatically. Keep stroke weight at 1.5px for visibility at small sizes.

---

## Asset 3: Marketplace Banner / Hero Image

**File:** `banner.png`  
**Size:** 1200×300 px (VS Code Marketplace header format)  

**Layout:**
- Background: Horizontal gradient `#0d0d14` → `#1a1a2e`, with very faint horizontal lines suggesting musical staff lines (5 parallel lines, `#ffffff` at 3% opacity)
- Left third: The 128px icon centered vertically with a soft purple glow
- Center: **"Attacca"** in Geist or Inter, ~56px, white, semi-bold, italic. Below in ~18px `#6a6a8a`: *"proceed without pause"*
- Right third: A minimal flow diagram showing the agent relay:

  ```
  [Manager] ──║──> [Engineer] ──║──> [Security] ──> push
  ```

  Boxes in outline (`#8b7cf6` border), text inside in white. The `║` symbols between them are double bar lines in `#5ec4d4`. The `>` arrows continue the rightward flow.

- Subtle vertical bar lines at regular intervals across the bottom edge (like bar lines in a score), `#8b7cf6` at 8% opacity

**Feel:** A concert program cover, not a SaaS landing page. Dark, refined, precise.

---

## Asset 4: README Hero / Dashboard Screenshot Mockup

**File:** `screenshot-dashboard.png`  
**Size:** 1200×750 px  

**What it shows:** A VS Code dark theme window with the Attacca sidebar dashboard open.

**Dashboard panel contents to depict:**
```
╔─────────────────────────────╗
│  Attacca                    │
│  ─────────────────────────  │
│  ● ACTIVE                   │
│  engineer  ·  Phase 3       │
│                             │
│  Task:                      │
│  Implement auth middleware   │
│  and write tests            │
│                             │
│  Last Agent:  manager       │
│  Security:    ✓ cleared     │
│                             │
│  ┌──────────┬──────────┐    │
│  │ Manager  │ Engineer │    │
│  ├──────────┼──────────┤    │
│  │ Security │ Designer │    │
│  ├──────────┼──────────┤    │
│  │Consultant│ Medic    │    │
│  └──────────┴──────────┘    │
│                             │
│  [View State] [Handoff]     │
│  [Pick Skill] [Updates]     │
╚─────────────────────────────╝
```

**Surrounding chrome:** Activity bar on left with the Attacca icon (double bars) highlighted. Status bar at bottom showing `Engineer · Phase 3`. Editor area on right showing a blurred/minimal TypeScript file. Colors from the palette — `#0d0d14` background, purple accents on active elements, green on "ACTIVE" indicator.

---

## Asset 5: Scaffold Wizard Screenshot Mockup

**File:** `screenshot-scaffold.png`  
**Size:** 1200×750 px  

**What it shows:** VS Code quick pick dropdown mid-wizard — step 1 (tool selection).

```
┌──────────────────────────────────────────────────┐
│  Attacca — Step 1/4: Select Tools                │
│  ────────────────────────────────────────────     │
│  > GitHub Copilot (VS Code)              ← sel   │
│    Cursor                                        │
│    Claude Code CLI                               │
│    Codex CLI (OpenAI)                            │
│    Cline                                         │
│    Windsurf                                      │
│    Gemini CLI                                    │
│    Antigravity                                   │
└──────────────────────────────────────────────────┘
```

Floating over dimmed VS Code editor. Standard VS Code quick pick styling — highlight on selected item.

---

## Asset 6: Status Bar Detail

**File:** `screenshot-statusbar.png`  
**Size:** 800×80 px (cropped strip)  

**Shows:** VS Code status bar with two Attacca items:
- `Engineer · Phase 3` — white text on standard dark bar
- `⚠ BLOCKED: waiting for PR review` — dark text on amber background (`#f0c050`)

Clean close-up, no surrounding UI.

---

## Asset 7: Animated Demo GIF (optional, high-value)

**File:** `demo.gif`  
**Duration:** 15–20 seconds, looping  
**Size:** 1000×600 px  

**Sequence:**
1. (0–3s) Command Palette → "Attacca: Initialize Project"
2. (3–8s) 4-step wizard: Copilot → Full agents → Detailed → Engineering
3. (8–12s) Progress notification: "Attacca: Initializing project… done ✓"
4. (12–16s) Dashboard sidebar opens — live state, agent buttons
5. (16–20s) User clicks "Engineer" → Copilot Chat opens with handoff prompt

**If generating static frames:** One 1000×600 PNG per step.

---

## Asset 8: Open Graph / Social Card

**File:** `og-card.png`  
**Size:** 1200×630 px (standard OG format)  

**Layout:**
- Full background: `#0d0d14`
- Center: **"Attacca"** in 72px, white, italic, semi-bold. Below: *"Multi-agent AI coding orchestrator"* in 24px `#6a6a8a`
- Faint musical staff lines in background (5 parallel horizontal lines at 3% opacity)
- Bottom-left: The Attacca icon (double bars) small, 48px
- Bottom-right: `attacca.dev` in 16px `#6a6a8a` (placeholder URL)

**Purpose:** GitHub repo card, social sharing, blog posts.

---

## Design Rules

**DO:**
- Dark backgrounds always — `#0d0d14` or `#1a1a2e`
- Musical notation references: staff lines, bar lines, the double bar (║), dynamic markings
- Structured geometry: parallel lines, grids, directional flow (left → right)
- Purple + teal as the primary accent pair
- Italicize "Attacca" in body text
- Think: concert program, studio monitor, sheet music — precise, refined, silent

**DO NOT:**
- Musical instruments (no piano keys, no treble clefs, no guitars)
- Waveforms or audio/DJ imagery
- Robot icons, brain icons, neural network visuals
- Heavy gradients or neon
- Bright backgrounds
- Playful or comic fonts
- The word "boilerplate" anywhere

---

## Deliverable Summary

| # | File | Size | Priority |
|---|---|---|---|
| 1 | `icon.png` | 128×128 px | **REQUIRED** for Marketplace |
| 2 | `icon@2x.png` | 256×256 px | Recommended (retina) |
| 3 | `icon.svg` | 24×24 viewBox | Activity bar icon |
| 4 | `banner.png` | 1200×300 px | Marketplace header |
| 5 | `screenshot-dashboard.png` | 1200×750 px | README + Marketplace |
| 6 | `screenshot-scaffold.png` | 1200×750 px | README + Marketplace |
| 7 | `screenshot-statusbar.png` | 800×80 px | README |
| 8 | `og-card.png` | 1200×630 px | Social sharing |
| 9 | `demo.gif` | 1000×600 px | README (optional) |

**Place all files in:** `vscode-extension/media/`

**After adding `icon.png`, update `vscode-extension/package.json`:**
```json
"icon": "media/icon.png"
```

---

## Context for AI Generation

Attacca is a VS Code sidebar panel + status bar + command palette extension. It scaffolds multi-agent AI coding workflows where specialized agents (Manager, Engineer, Security, Designer, Researcher, Consultant, Medic) hand off work to each other through structured state files. It does NOT run AI models — it's the orchestration layer.

The name comes from the musical instruction *attacca*: proceed to the next movement without stopping. The visual identity should feel like: a dark concert hall where code is being composed. Not a SaaS landing page. Not a toy. Not a chatbot wrapper. Something a senior engineer would glance at and immediately understand: this is the control plane for my AI agent system.
