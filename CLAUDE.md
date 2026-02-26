# CLAUDE.md — The Complete ADU Homeowner's Guide

## What This Is

A tiered digital product ($97/$197/$297) on Gumroad — the first comprehensive, nationally-scoped ADU construction guide for homeowners. Written by Michael Colenso, a construction PM with 20+ years managing $12M–$200M projects in the Pacific Northwest.

**The author's voice is an experienced construction PM across the table from a homeowner — not a contractor selling services, not a lender pushing loans.** Independent and from the owner's side of the table.

## Project Map

```
guide/          → Markdown chapter source (12 chapters across 5 parts)
regulations/    → State-by-state ADU regulation research (uses regulations/_template.md)
tools/          → Downloadable calculators, checklists, templates (Excel/PDF)
research/       → Market data, cost benchmarks, source citations
marketing/      → Sales page, lead magnet, email sequences, SEO content
build/          → Compilation scripts and tier packaging
video/          → Video module scripts (Complete tier)
quality/        → Style guide, fact-check log, review checklists
agent_docs/     → Detailed reference docs — read these on demand when relevant
```

## How to Work

**Before writing any content**, read the relevant reference docs:
- Writing a chapter → read `agent_docs/content-outline.md` and `quality/style-guide.md`
- Researching a state → read `agent_docs/research-protocol.md` and `regulations/_template.md`
- Building a tool → read `agent_docs/tool-standards.md`
- Marketing/sales copy → read `agent_docs/product-architecture.md`

**Research workflow — this applies to everything:**
1. Search for current data before writing. Never rely on training data for legislation, costs, or market stats.
2. Use primary sources: state legislature sites, city planning departments, published bill text.
3. Log every source in `research/sources.md` with URL and access date.
4. Flag anything unverifiable with `[VERIFY]` and add it to `quality/fact-check-log.md`.

**Build commands:**
```bash
npm run build:guide       # Compile chapters → PDF
npm run build:tools       # Generate calculators and checklists
npm run build:foundation  # Package $97 tier bundle
npm run build:builder     # Package $197 tier bundle
npm run build:complete    # Package $297 tier bundle
npm run build:all         # Everything
```

## Priority Order

Work on things in this order. Ship Foundation tier first to validate demand.

1. Lead magnet: `marketing/lead-magnet/adu-feasibility-checklist.md`
2. Chapters 1–3 (Part I), then Chapter 5 state regulations for CA, WA, OR, MA, CO
3. Chapters 4, 6–12 (remainder of guide)
4. Foundation tier tools: basic budget calculator, feasibility scorecard, design matrix
5. Builder tier tools: contractor toolkit, financing matrix, PM timeline, permit checklists (5 cities)
6. State regulations expanded to 15 states
7. Complete tier assets: ROI calculator, contract template, 25-city permits, video scripts
8. Marketing: sales page, email sequences, SEO content

## Universal Rules

**Always prefer ranges over point estimates for costs.** "$150,000–$250,000" not "$200,000."

**Always note when information is jurisdiction-specific.** Default framing is national; call out state/city divergences explicitly.

**Every factual claim needs a source.** Category A (legislation, fees, stats) must be verified with primary sources. Category B (cost ranges, timelines) needs industry sources. Category C (process descriptions, best practices from author experience) needs no external source. See `agent_docs/research-protocol.md`.

**Use prose, not bullet lists, in the guide content.** Lists only for sequential steps, checklists, or structured comparisons.

**Cross-reference naturally:** "See Chapter 7 for contractor vetting" not page numbers.

## Subagent Guidance

This project has clearly parallelizable work. When using Task() to spawn subagents:

- **Content writing** and **regulation research** can run in parallel — they share `research/sources.md` so check for duplicate entries before adding.
- **Tool development** is independent and can run alongside content work.
- If two agents produce conflicting data (e.g., different cost figures), the one with the more recent primary source wins. Flag conflicts in `quality/fact-check-log.md`.

## File Conventions

Chapters: `ch01-descriptive-name.md` (zero-padded, kebab-case). State regulations: `california.md` (lowercase, full state name). Permit checklists: `los-angeles.pdf`. Calculators: `budget-calculator-basic.xlsx`. All generated output goes in `build/output/` (gitignored).
