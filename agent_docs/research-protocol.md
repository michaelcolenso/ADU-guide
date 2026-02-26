# Research Protocol

Read this document before writing any content that involves factual claims — which is essentially everything in this project. ADU legislation, costs, and market data change constantly. The guide's credibility depends entirely on accuracy.

## Source Categories

**Category A — Must verify with primary source before including:**
Legislative provisions (bill numbers, effective dates, specific requirements), government fee schedules and timelines, financial product terms (loan limits, interest rates, qualifications), statistics cited with specific numbers. Always search and verify. Never use training data for these.

**Category B — Verify with industry sources:**
Construction cost ranges, timeline estimates, market statistics (permit counts, growth rates). Multiple corroborating sources preferred.

**Category C — Author expertise (no external source required):**
Construction process descriptions, best practice recommendations, decision frameworks, common mistake descriptions based on 20+ years of professional experience. These can be stated as author opinion/experience.

## Search-First Workflow

1. Before writing a claim, search for current data.
2. When search returns contractor blogs or aggregator sites, trace back to the original source (state legislature, census data, industry association).
3. Add every source to `research/sources.md` using this format:
   ```
   - **Claim:** [specific claim]
   - **Source:** [publication/org]
   - **URL:** [full URL]
   - **Accessed:** [YYYY-MM-DD]
   - **Category:** A / B / C
   ```
4. If you can't verify a data point, mark it `[VERIFY]` in the manuscript and add it to `quality/fact-check-log.md`.

## Ranges Over Point Estimates

Cost data should always be ranges reflecting regional and project variation. "$150,000–$250,000" not "$200,000." This is both more honest and more defensible — a reader who was quoted $280,000 won't immediately distrust a guide that said "$150K–$250K+" but will distrust one that said "$200,000."

## Legislative Currency

All legislative references must specify the bill number, year, and effective date. "California requires..." is insufficient. "California's AB 68 (effective 2020) requires..." is the standard.

When referencing legislation, note whether it's currently effective, pending, or proposed. A bill that passed committee but hasn't been signed is different from current law.

## Common Traps

Many "ADU cost calculators" online are marketing tools for specific contractors or lenders. Cross-reference cost data across multiple sources.

California ADU law changes with every legislative session. A source from 2022 about California ADU rules is almost certainly incomplete — at minimum, AB 2533, SB 1211, AB 1033, and AB 976 (all 2024) are missing.

National statistics about "homeowner interest in ADUs" often come from surveys commissioned by ADU companies. Note the sponsor when citing survey data.
