# Gateway Scene Design (2026-03-03)

## Summary
Add a new Gateway flow scene to `src/OpenClawArchitecture.tsx`, matching the existing visual language. The scene presents a single-screen horizontal flow diagram with sequential highlight animations to explain the execution pipeline in `gateway.md`.

## Goals
- Visualize the Gateway pipeline without over-design.
- Keep implementation small, readable, and consistent with current Remotion styles.
- Auto-adjust scene duration based on number of steps.

## Non-Goals
- No deep per-step explanations or extra panels.
- No new external assets or heavy layout frameworks.

## Layout & Structure
- One full-screen scene, centered horizontal flow.
- Nodes (rounded cards) connected by arrow/line segments.
- Steps in order:
  1. User Input
  2. Gateway
  3. Intent Parsing
  4. Module Routing
  5. Node Execution
  6. Result Aggregation
  7. Return to User

## Animation
- Each step animates in sequence with:
  - opacity from 0 → 1
  - slight upward motion
  - line/arrow glow activated with the step
- Gateway node uses accent color to stand out.
- Final subtle pulse across the whole line to signal completion.

## Data Flow
- Uses `frame` and existing color props only.
- No external data, no state, no hooks beyond Remotion animation helpers.

## Edge Cases
- Text wrapping avoided by fixed-width cards.
- If overall width is tight, reduce gap and font size slightly.

## Verification
- Preview render: confirm step order, timing cadence, and node emphasis.
- Visual check for alignment, clipping, and line continuity.
