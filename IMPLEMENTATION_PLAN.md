# IMPLEMENTATION PLAN — GatiPath

## Phase 1 — Project Foundation & Setup
- [x] Workspace inspection and architecture selection (React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide).
- [x] Initial architecture and core documentation.
- [x] Scaffold Vite React-TS project in `/home/victor/gatipath`.
- [x] Configure Tailwind CSS with the defined educational palette (`#F7F8F5`, `#246B50`, `#202A25`, `#DDEBE2`, `#C77A45`).
- [x] Implement relational client database store with localStorage persistence and seed data.
- [x] Implement role-based Authentication context with one-click demo switcher and reset data capability.

## Phase 2 — Core Adaptive Engine
- [x] Implement `mastery.ts`: Exponential moving average (EMA) formula `new = old*0.7 + score*0.3`.
- [x] Implement `misconceptions.ts`: Catalog & detection rules (denominator error, reciprocal error, LCM error, etc.).
- [x] Implement `prerequisites.ts`: DAG traversal and prerequisite gap checks.
- [x] Implement `difficulty.ts`: Dynamic item selector based on rolling accuracy window.
- [x] Implement `recommendation.ts`: Explainable recommendation generator prioritizing misconceptions > prerequisites > pacing.
- [x] Unit test adaptive engine with Vitest (8 of 8 tests passing).

## Phase 3 — Curriculum Content & Math Pilot
- [x] Topic 1: Understanding Fractions (Proper/Improper, Equivalent, Simplifying).
- [x] Topic 2: Comparing Fractions (Common denominators, LCM, ordering).
- [x] Topic 3: Addition & Subtraction (Common vs different denominators, LCM, simplifying).
- [x] Topic 4: Multiplication & Division (Reciprocal, fraction word problems).
- [x] Curate 32 mathematically verified questions with hints, step explanations, and misconception mappings.
- [x] Build interactive SVG fraction visual models (`FractionBar`, `FractionPie`).

## Phase 4 — Student Workflow Screens
- [x] Student Dashboard: Progress overview, continue current topic, active adaptive recommendation callout.
- [x] Learning Path: Visual prerequisite map with locked/unlocked statuses and prerequisite explanations.
- [x] Learn Screen: Bite-sized concepts, visual SVG demonstrations, step-by-step worked examples.
- [x] Solve Screen: Adaptive practice, immediate feedback, hint reveal with 70 credit notice, misconception remedial cards.
- [x] Test Screen: Multi-question assessment without hints, instant score summary, mastery progression.
- [x] Assessments List: Topic checkpoints overview.

## Phase 5 — Teacher Workflow Screens
- [x] Teacher Dashboard: Class overview, students needing attention, common class misconceptions, topic averages.
- [x] Student Roster: Searchable/filterable list with topic mastery badges and status indicators.
- [x] Student Deep-Dive Profile: Detailed question attempt logs, misconception frequency, adaptive engine diagnosis.
- [x] Teacher Interventions: Assign remedial tasks, log teacher notes, toggle completed states.
- [x] Class Insights: Topic difficulty ranking, misconception distribution charts.

## Phase 6 — Verification & Scenario Testing
- [x] Execute Aarav scenario:
  1. Aarav logs in (`student@gatipath.demo`).
  2. Goes to Addition & Subtraction -> Answers 1/4 + 1/4 = 2/8.
  3. System flags `denominator_addition_error`.
  4. System renders visual fraction explanation.
  5. Aarav answers guided questions correctly -> Mastery updates.
  6. Aarav takes test.
  7. Teacher logs in (`teacher@gatipath.demo`) -> Inspects Aarav's mistake, remedial action, and verifies intervention status.
- [x] Vitest test suite passing (8/8).
- [x] Cross-browser / mobile responsive layout verified (360px+).

## Phase 7 — Deployment & Public Verification
- [x] Production build generated cleanly with zero errors.
- [x] Deployed publicly to GitHub Pages: [https://pratikbisen.github.io/gatipath/](https://pratikbisen.github.io/gatipath/).
- [x] Live assets verified HTTP 200 OK.
