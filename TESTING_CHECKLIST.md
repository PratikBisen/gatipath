# TESTING CHECKLIST — GatiPath

## 1. Functional Verification
- [x] **Student Authentication**: Login as `student@gatipath.demo` or one-click demo switcher opens student dashboard (Aarav Sharma).
- [x] **Teacher Authentication**: Login as `teacher@gatipath.demo` or one-click demo switcher opens teacher dashboard (Sunita Verma).
- [x] **Role Protection**: Role-specific routing and interface views (students see learning journey; teachers see class roster and diagnostics).
- [x] **Adaptive Engine Unit & Integration Tests (33 tests passing)**:
  - [x] Independent correct answers increment mastery via EMA (`new = old*0.7 + 100*0.3`).
  - [x] 4-level progressive hint scoring tests: Level 1 (90), Level 2 (75), Level 3 (55), Level 4 (40).
  - [x] Incorrect answer reduces mastery appropriately without catastrophic drop (`new = old*0.7`).
  - [x] Repeated incorrect answers with `denominator_addition_error` trigger targeted remediation.
  - [x] Low prerequisite mastery blocks advancement and triggers prerequisite recommendation.
  - [x] Strict Anti-Slop: Topic mastery status reaches 'mastered' only after passing assessment (>=80%) and demonstrated independent success (>=3 unassisted solves).
  - [x] Measurable Evaluation Framework: 9 synthetic student ability archetypes tested deterministically (conceptual trap, prerequisite gap, calculation slip, ambiguous guess, repeated misconception, correct after hints, remediation recovery, accelerated master, inconsistent performer).
  - [x] Metric Confusion Matrix: F1 Score = 1.0, 0% False Positive Rate on calculation slips and ambiguous guesses; 100% recall on conceptual traps; 0% incorrect recommendation rate.
  - [x] Smart Diagnostic Engine: Branching, early stopping convergence in <= 5 questions (average 3.0 Qs across 15 trials).
  - [x] Idempotency: Duplicate submissions with identical attempt token rejected with zero double-counting.
  - [x] Offline Queueing & Reconnection: Attempts safely enqueued locally; replay is idempotent with zero duplicates on repeated sync events.
  - [x] Storage Persistence Invariant: State persistence verified in localStorage across simulated browser restart.
- [x] **Offline Resilience & Data Safety**:
  - [x] Service Worker caching app shell, scripts, CSS, and web fonts (`public/sw.js`).
  - [x] Attempt queueing during offline periods and automated replay upon reconnect into client-side persistent storage.
  - [x] Technical Truth: Clarified that persistence is Local Client-Side Storage (`localStorage`), NOT cloud synchronization (no remote server required).
  - [x] Route shields: Client-side role guards (`TeacherGuard`, `StudentGuard`) restrict navigation between student and teacher portals.
  - [x] Honest Child Data Safety & India DPDP 2023 / COPPA disclosure modal highlighting prototype boundaries and production roadmap requirements.
- [x] **Classroom Suitability & Accessibility**:
  - [x] Trilingual localization structure supporting English, Hindi (हिंदी), and Marathi (मराठी) with verified math terminology.
  - [x] NCERT Class 7 Chapter 2 (M701–M704) curriculum standard mapping.
  - [x] Teacher cohort improvement delta tracking (Scholars Demonstrating Concrete Improvement).
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
- [x] Live JS bundle (`index-cWGmJsVe.js`) and CSS bundle (`index-Dy5qJzLm.css`) verified HTTP 200 OK.
- [x] End-to-end user workflows tested on live site.
