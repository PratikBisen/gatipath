# IMPLEMENTATION PLAN — GatiPath

## Phase 1 — Project Foundation & Setup
- [x] Workspace inspection and technology stack selection (React + TS + Vite + Tailwind + Lucide).
- [x] Initial architecture and core documentation.
- [ ] Scaffold Vite React-TS project in `/home/victor/gatipath`.
- [ ] Configure Tailwind CSS with the defined educational palette (`#F7F8F5`, `#246B50`, `#202A25`, etc.).
- [ ] Implement data types and client database store with persistence and demo data seeding.
- [ ] Implement role-based Authentication context (Student Demo, Teacher Demo, fast switcher).

## Phase 2 — Core Adaptive Engine
- [ ] Implement `mastery.ts`: Exponential moving average (EMA) formula `new = old*0.7 + score*0.3`.
- [ ] Implement `misconceptions.ts`: Misconception detection rules (denominator error, reciprocal error, LCM error, etc.).
- [ ] Implement `prerequisites.ts`: DAG validation and prerequisite gap detection.
- [ ] Implement `recommendation.ts`: Explainable recommendation generator prioritizing misconceptions > prerequisites > difficulty pacing.
- [ ] Write automated unit tests for the adaptive engine and verify with Vitest/Node test runner.

## Phase 3 — Curriculum Content & Math Pilot
- [ ] Topic 1: Understanding Fractions (Proper/Improper, Equivalent, Simplifying).
- [ ] Topic 2: Comparing Fractions (Common denominators, LCM, ordering).
- [ ] Topic 3: Addition & Subtraction (Common vs different denominators, LCM, simplifying).
- [ ] Topic 4: Multiplication & Division (Reciprocal, fraction word problems).
- [ ] Curate 32 mathematically verified questions with hints, step explanations, and misconception mappings.
- [ ] Build interactive SVG visual representations (Fraction bars, fraction circle pie models).

## Phase 4 — Student Workflow Screens
- [ ] Student Dashboard: Progress overview, continue current topic, active recommendation callout.
- [ ] Learning Path: Visual prerequisite map with locked/unlocked statuses.
- [ ] Learn Screen: Bite-sized concepts, visual SVG demonstrations, step-by-step worked examples.
- [ ] Solve Screen: Adaptive practice, immediate step-by-step evaluation, hint reveal with score adjustment, misconception remedial cards.
- [ ] Test Screen: Multi-question assessment without hints, instant score summary, mastery progression.

## Phase 5 — Teacher Workflow Screens
- [ ] Teacher Dashboard: Class overview, students needing attention, common class misconceptions.
- [ ] Student Roster: Searchable/filterable list with topic mastery badges and status indicators.
- [ ] Student Deep-Dive Profile: Detailed question attempt logs, misconception frequency, adaptive engine diagnosis.
- [ ] Teacher Interventions: Assign remedial tasks, log teacher notes, toggle completed states.
- [ ] Class Insights: Topic difficulty ranking, misconception distribution charts.

## Phase 6 — Verification & Scenario Testing
- [ ] Execute Aarav scenario:
  1. Aarav logs in.
  2. Goes to Addition & Subtraction -> Answers 1/4 + 1/4 = 2/8.
  3. System flags `denominator_addition_error`.
  4. System renders visual fraction explanation.
  5. Aarav answers guided questions correctly -> Mastery updates.
  6. Aarav takes test.
  7. Teacher logs in -> Inspects Aarav's mistake, remedial action, and verifies intervention status.
- [ ] Run test suite.
- [ ] Cross-browser / mobile viewport testing (360px, 390px, 768px, 1200px).

## Phase 7 — Deployment & Public Verification
- [ ] Build production bundle (`npm run build`).
- [ ] Deploy to public hosting (Vercel / GitHub Pages).
- [ ] Verify live URL, demo accounts, and end-to-end user workflows.
