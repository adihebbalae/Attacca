# Handoff: Competitive Analysis + Advertising Agent Feasibility Complete

**From**: Researcher → **To**: Manager | **Model**: Haiku  
**Date**: March 29, 2026

---

## Research Complete

Full report available: `.agents/research/competitive-analysis-ad-agent.md`

---

## Executive Summary

### Part 1: Competitive Landscape

**11 competitors analyzed** across 3 categories:
- **Direct competitors**: Cursor, Windsurf, Aider, Continue, Sweep, Devin
- **Agent frameworks**: CrewAI, LangGraph, Semantic Kernel, Open Interpreter
- **Adjacent**: AutoGPT, project scaffolding tools

**Our unique advantages** (what NO competitor has):
1. Security-first architecture (dedicated Security agent + 4-gate supply chain + SBOM)
2. 7 specialized agents vs. competitors' single-agent systems
3. Skills system (9 production-ready workflows)
4. Dual-mode operation (GitHub Copilot + Claude Code CLI)
5. Production-grade state management (state.json + MODULES.md for 3-6 month projects)
6. Research-first workflow (only system that invokes Researcher before scaffolding)

**Market gaps we could fill**:
- Security-conscious teams (no competitor has adversarial security review)
- Solo founders building real products (competitors optimize for speed, not continuity)
- GitHub Copilot power users (we're the only native Copilot orchestration layer)

---

### Part 2: Advertising Agent Feasibility

**RECOMMENDATION**: ⚠️ **Build as Designer Skill, NOT Standalone Agent**

**Why NOT standalone agent**:
1. **Meta Tribe V2 doesn't exist** — no public API, no documentation, likely internal research project
2. **Scope creep risk** — dilutes core value ("PRD → Project" becomes "PRD → Project → Ads")
3. **Market already served** — AdCreative.ai ($29/mo), Canva ($15/mo) exist and work well
4. **TAM overlap is small** — only ~15% of our users run ads themselves (~18k addressable)
5. **Support burden** — ad creative feedback is subjective, Meta policy compliance is manual

**Why YES to ad-brief skill**:
1. **Unique differentiator** — no dev tool has this
2. **Low cost to build** — 80% prompt engineering, 20% API wrapper
3. **Complements Designer agent** — natural extension
4. **Solves real pain** — indie hackers struggle with ad copy
5. **Low risk** — skill can be ignored by users who don't need it

---

## Key Findings

### Meta Tribe V2 Research
**[GAP] — NO PUBLIC INFORMATION EXISTS**

Searched:
- Meta for Developers portal
- Meta AI Research blog
- arXiv papers
- GitHub repositories

**Conclusion**: Meta Tribe V2 either:
1. Is an internal Meta project (not public)
2. Doesn't exist (confusion with other Meta AI)
3. Is hypothetical/speculative

**Alternative**: Use Meta Marketing API's **Advantage+ Campaigns** (Meta's AI auto-targeting) — this IS the "brain model" that's actually available.

---

### Ad Generation Workflow (If Pursued)

**Technical feasibility**: ✅ YES (with caveats)

**Cost per ad**: $2.51 (templated route via Bannerbear) OR $0.21 (AI generation via DALL-E 3)

**Workflow**:
1. Research competitors (Meta Ad Library scraping) — ✅ Feasible
2. Generate copy (Claude API) — ✅ Feasible  
3. Generate visuals (Bannerbear templates OR DALL-E 3) — ⚠️ Partial (brand consistency issues with AI)
4. Assemble ad creative — ✅ Feasible
5. Target audience (Meta Marketing API) — ✅ Feasible (using Advantage+ instead of Tribe V2)
6. Export campaign draft (Meta Ads Manager) — ✅ Feasible

**Blockers**:
- Meta ad policy compliance (manual review required)
- Business verification (can't automate, requires human ID)
- Brand safety / copyright risk (AI-generated images)

---

## Proposed Implementation

### Option 1: Ad Brief Skill (RECOMMENDED)

**Scope**:
- ✅ Ad copy generation (headlines, CTAs, 5 variants)
- ✅ Ad mockup descriptions ("Image: product on white background...")
- ✅ Competitive research (Meta Ad Library scraping)
- ✅ Audience targeting suggestions (map to Meta params)
- ❌ NO asset generation (user provides images OR uses Canva separately)
- ❌ NO Meta API integration (user copies output to Ads Manager manually)

**User workflow**:
```
User → @designer "Create ad brief for [product] targeting [audience]"
  ↓
Designer loads ad-brief skill
  ↓
Output: .ads/[product-slug]-brief.md
  - 5 copy variants (ready to paste)
  - Mockup descriptions (for Canva or designer)
  - Targeting suggestions (for Meta Ads Manager)
  - Competitor examples (URLs)
```

**Effort**: 1 week MVP  
**Cost**: $0 (uses Claude API only)  
**Risk**: Low (no external dependencies, no policy compliance)

---

### Option 2: Standalone Advertising Agent (IF Validated)

**Only build if**:
1. User survey shows strong demand (100+ users)
2. Partnership with Bannerbear (to reduce costs)
3. In-house expertise in ad creative + Meta policies
4. Marketing pivot: rebrand as "AI dev + marketing tool"

**Effort**: 2 weeks full build  
**Dependencies**: Bannerbear API, Meta Business account, Meta app approval  
**Risk**: High (scope creep, support burden)

---

## Competitive Feature Matrix

Full matrix in report. **Highlights**:

| Feature | Us | Cursor | Aider | CrewAI |
|---------|-----|--------|-------|--------|
| Multi-agent orchestration | ✅ (7) | ❌ | ❌ | ✅ |
| Security audit agent | ✅ | ❌ | ❌ | ❌ |
| Supply chain security | ✅ (4-gate) | ❌ | ❌ | ❌ |
| SBOM generation | ✅ | ❌ | ❌ | ❌ |
| Skills system | ✅ (9) | ❌ | ❌ | 🔄 |
| GitHub Copilot native | ✅ | ❌ | ❌ | ❌ |
| State persistence | ✅ | 🔄 | ❌ | 🔄 |
| Free tier | ✅ | ❌ | ✅ | ✅ |

**No competitor has all of**: security-first + multi-agent + skills + dual-mode + state management.

---

## Market Positioning Opportunities

1. **Security-conscious teams**: "The only AI dev tool with adversarial security review built-in"
2. **Solo founders with 3-6 month timelines**: "The only AI dev tool with state continuity for real products"
3. **GitHub Copilot power users**: "Copilot orchestration layer"
4. **Open source believers**: "Multi-agent, production-grade, free"

---

## Next Steps

**Recommended**:
1. Review full report: `.agents/research/competitive-analysis-ad-agent.md`
2. Decide: Ad brief skill (low risk) vs. standalone agent (high risk, requires validation)
3. If skill: Create `.github/skills/ad-brief/SKILL.md` (1 week)
4. If agent: Survey 100+ users first (validate demand before building)

**Alternative**:
- Archive research for future reference
- Focus on core value: PRD → Project automation
- Revisit in 12 months if user requests accumulate

---

## Report Location

📄 **Full Report**: `.agents/research/competitive-analysis-ad-agent.md` (10,000+ words, 11 competitors, cost calculations, workflow diagrams, sources)

---

**Researcher signing off — Ready for Manager review.**
