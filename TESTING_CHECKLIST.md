# TESTING CHECKLIST — GatiPath

## 1. Functional Verification
- [x] **Student Authentication**: Login as `student@gatipath.demo` or one-click demo switcher opens student dashboard (Aarav Sharma).
- [x] **Teacher Authentication**: Login as `teacher@gatipath.demo` or one-click demo switcher opens teacher dashboard (Sunita Verma).
- [x] **Role Protection**: Role-specific routing and interface views (students see learning journey; teachers see class roster and diagnostics).
- [x] **Adaptive Engine Unit Tests (Vitest)**:
  - [x] Independent correct answers increment mastery via EMA (`new = old*0.7 + 100*0.3`).
  - [x] Hint-assisted answers award partial score credit (70).
  - [x] Incorrect answer reduces mastery appropriately without catastrophic drop (`new = old*0.7`).
  - [x] Repeated incorrect answers with `denominator_addition_error` trigger targeted remediation.
  - [x] Low prerequisite mastery blocks advancement and triggers prerequisite recommendation.
  - [x] Strict Anti-Slop: Topic mastery status reaches 'mastered' only after passing assessment (>=80%) and demonstrated independent success.
- [x] **Mathematical Content Accuracy**:
  - [x] All 32 curriculum questions mathematically verified.
  - [x] Worked examples contain valid mathematical steps and correct fractions.
  - [x] Visual models render accurate parts and fractions.
- [x] **Interactive Practice (Solve Mode)**:
  - [x] Answer evaluation works cleanly with immediate feedback.
  - [x] Misconception card appears with visual fraction model comparison (e.g. 1/4 + 1/4 = 2/4 vs 2/8).
  - [x] Next question adjusts difficulty based on recent performance window.
- [x] **Summative Assessment (Test Mode)**:
  - [x] Hints are disabled.
  - [x] Question stepper allows navigation across all 5 test questions.
  - [x] Submitting assessment calculates final score, passes at >=80%, and updates topic mastery status.
- [x] **Teacher Management**:
  - [x] Dashboard displays real statistics calculated from seeded database records.
  - [x] Student profile renders logged attempts with timestamps, answers, and hints used.
  - [x] Teacher can assign custom intervention with strategy and note.
  - [x] Toggling intervention status updates persistently.
- [x] **Data Persistence & Reset**:
  - [x] Browser refresh maintains all progress and history.
  - [x] "Reset Demo Data" button restores initial pristine demonstration state.

## 2. Visual & Responsive Design
- [x] Mobile 360px viewport: no horizontal overflow, bottom navigation bar active, touch targets >= 44px.
- [x] Tablet 768px viewport: grid adapts naturally from 1 to 2 columns.
- [x] Desktop 1280px+ viewport: full multi-column layout with sidebar metrics.
- [x] Color palette strictly adheres to `DESIGN_SYSTEM.md`: `#F7F8F5` canvas, `#246B50` forest primary, `#202A25` charcoal, `#C77A45` accent.

## 3. Deployment & Live Verification
- [x] `npm run build` succeeds with zero TypeScript or PostCSS errors.
- [x] Public live deployment active at: `https://pratikbisen.github.io/gatipath/`.
- [x] Live JS bundle (`index-DQK_KRLX.js`) and CSS bundle (`index-BD6R0nk5.css`) verified HTTP 200 OK.
- [x] End-to-end user workflows tested on live site.
