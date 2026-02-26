# The Complete ADU Homeowner's Guide

> From Concept to Keys: Everything You Need to Build Your ADU

A tiered digital product ($97 / $197 / $297) for homeowners navigating ADU construction. Sold on Gumroad.

## Setup

```bash
git clone <repo-url> && cd adu-guide && npm install
```

## Build

```bash
npm run build:all     # Build everything
npm run build:guide   # Compile guide PDF only
npm run build:tools   # Generate tools only
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
