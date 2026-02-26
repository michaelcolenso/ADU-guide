# Tool Development Standards

Read this before building any calculator, checklist, or template. These standards ensure consistency across all tools and professional quality that justifies the tier pricing.

## Excel Calculator Standards

**Color coding (apply consistently across all calculators):**
- Input cells: light yellow background (#FFF8DC) with a thin border
- Calculation cells: light blue background (#E8F4FD), locked/protected
- Output/summary cells: light green background (#E8F5E9), bold text

**Required sheets in every calculator:**
1. "Instructions" — first tab, explains how to use the calculator, what each input means, and where to find the data to enter
2. The calculator itself (one or more functional tabs)
3. "Sources" — last tab, citing every benchmark figure, regional cost factor, or external data point used

**Data validation:** Use dropdown lists for state/city selection, number ranges for costs (prevent negative values), and conditional formatting to flag unusual entries.

**Testing:** Before considering a calculator complete, test with zero values in all inputs, maximum reasonable values, and missing/blank inputs. Formulas should handle all cases gracefully (no #DIV/0!, #REF!, or #VALUE! errors).

## Budget Calculator Specifics

**Basic (Foundation tier):** Single sheet with 14 cost categories. Inputs are national average ranges. Outputs are estimated total range and per-square-foot cost.

**Advanced (Builder/Complete):** Adds a regional cost adjustment tab with factors for CA, Pacific NW, Mountain West, Southwest, Southeast, Northeast, Midwest. Includes separate hard cost and soft cost breakdowns, contingency calculation (10–15% auto-calculated), and a monthly cash flow projection based on construction timeline.

**The 14 cost categories:** Design/architecture, engineering (structural, civil, geotechnical), permits and fees, site preparation, foundation, framing, roofing, MEP rough-in, insulation/drywall, finishes (flooring, cabinets, fixtures), exterior, utility connections, landscaping/hardscape, contingency.

## Financing Comparison Matrix

**Overview (Foundation):** Static summary table comparing HELOCs, construction loans, HomeStyle, FHA 203(k), cash-out refi, state programs. Columns: typical rate range, term, max amount, qualification summary, pros, cons.

**Interactive (Builder/Complete):** User inputs their home value, existing mortgage balance, credit score range, and desired ADU budget. Calculator shows which financing options they likely qualify for, estimated monthly payments, total interest cost, and break-even timeline. Scenario tabs for "conservative," "moderate," and "optimistic" assumptions.

## ROI & Rental Income Calculator (Complete tier)

Inputs: ADU size, construction cost, estimated rental income (with Zillow/Rentometer lookup guidance), vacancy rate, property management costs, insurance, maintenance reserve, property tax impact.

Outputs: Annual cash flow, cash-on-cash return, break-even year, 10-year cumulative return, property value impact estimate.

## Fillable PDF Checklists

Use fillable PDF format with interactive checkboxes. Each checklist item should include a brief "why it matters" explanation, not just the label. Group items into logical sections with a "Notes" text field after each section.

## Permit Checklists (jurisdiction-specific)

These are the highest-research-effort tools. Each city checklist must include: exact department name and contact info, current fee schedule, required submission documents (with specifics — "site plan at 1"=20' scale" not just "site plan"), typical review timeline, common rejection reasons specific to that city, pre-approved plan availability, and any online portal URLs.

Verify all information against the city's current planning department website. Permit fees and processes change; date-stamp each checklist.

## PM Timeline Template

Use an editable Gantt chart format. Phases with realistic ADU durations:
- Pre-construction (design + permitting): 3–6 months
- Site preparation: 1–2 weeks
- Foundation: 1–2 weeks
- Framing: 2–3 weeks
- Roofing: 1 week
- MEP rough-in: 2–3 weeks
- Inspections (rough): 1–2 weeks
- Insulation + drywall: 2–3 weeks
- Finishes: 3–5 weeks
- Final inspections: 1–2 weeks
- Punch list + CO: 1–2 weeks

Total construction phase: 4–6 months typical. Include columns for: phase, planned start, planned end, actual start, actual end, notes, and payment milestone.

## Contract and Legal Templates

Every legal template needs this disclaimer prominently displayed: "This template is provided for educational and reference purposes only. It does not constitute legal advice. Consult a licensed attorney in your jurisdiction before using any contract for an actual construction project."
