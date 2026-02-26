# The Complete ADU Homeowner's Guide

> From Concept to Keys: Everything You Need to Build Your ADU

A tiered digital product ($97 / $197 / $297) for homeowners navigating ADU construction. Sold on Gumroad.

## Setup

```bash
git clone <repo-url> && cd adu-guide && npm install
```

## Build

```bash
npm run build         # Build guide + tools + tiers
npm run build:guide   # Compile markdown guide artifacts
npm run build:tools   # Collect tools/templates/checklists
npm run build:tiers   # Package foundation/builder/complete bundles
npm run build:foundation # Package only foundation tier bundle
npm run build:builder    # Package only builder tier bundle
npm run build:complete   # Package only complete tier bundle
npm run build:all     # Alias for npm run build
```

## Key Files

- `CLAUDE.md` — Agent instructions (read by Claude Code at session start)
- `.claude/rules/` — Scoped rules loaded per-directory
- `.claude/commands/` — Reusable task workflows
- `agent_docs/` — Detailed reference docs (read on demand)
- `quality/style-guide.md` — Writing standards
- `regulations/_template.md` — State regulation entry format

## Author

**Michael Colenso** — Construction PM, 20+ years, $12M–$200M projects, Procore & Buildertrend certified.
