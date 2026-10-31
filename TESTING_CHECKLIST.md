# TESTING CHECKLIST — GatiPath

## 1. Functional Verification
- [ ] **Student Authentication**: Login as `student@gatipath.demo` or one-click switcher opens student dashboard.
- [ ] **Teacher Authentication**: Login as `teacher@gatipath.demo` opens teacher dashboard.
- [ ] **Role Protection**: Student cannot navigate to teacher routes; teacher has class-wide management capabilities.
- [ ] **Adaptive Engine Unit Tests**:
  - [ ] Independent correct answers increment mastery via EMA.
  - [ ] Hint-assisted answers award partial score credit (70).
  - [ ] Incorrect answer reduces mastery appropriately without catastrophic drop.
  - [ ] Multiple incorrect answers with `denominator_addition_error` trigger targeted remediation.
  - [ ] Low prerequisite mastery blocks advancement and triggers prerequisite recommendation.
  - [ ] Topic mastery reaches >= 85 only after passing assessment and demonstrated independent success.
- [ ] **Mathematical Content Accuracy**:
  - [ ] All 32 questions verified for mathematical accuracy.
  - [ ] No ambiguous fraction syntax.
  - [ ] Worked examples contain valid mathematical steps.
- [ ] **Interactive Practice (Solve Mode)**:
  - [ ] Answer evaluation works for both choice selection and fraction input.
  - [ ] Misconception card appears with visual fraction model when error matches catalog.
  - [ ] Next question adjusts difficulty based on recent performance window.
- [ ] **Summative Assessment (Test Mode)**:
  - [ ] Hints are disabled.
  - [ ] Submitting assessment calculates final score and updates student topic progress status.
- [ ] **Teacher Management**:
  - [ ] Dashboard displays accurate counts computed from database.
  - [ ] Student profile renders all logged attempts with timestamps, answers, and hints used.
  - [ ] Creating an intervention updates the student's recommendation feed.
  - [ ] Marking intervention complete updates status persistently.
- [ ] **Data Persistence & Reset**:
  - [ ] Browser refresh maintains progress and history.
  - [ ] "Reset Demo Data" restores initial pristine demo state.

## 2. Visual & Responsive Design
- [ ] Mobile 360px viewport: no horizontal scrollbar, touch targets >= 44px, bottom nav functional.
- [ ] Tablet 768px viewport: multi-column layout expands naturally.
- [ ] Desktop 1280px+ viewport: sidebar navigation, spacious cards, academic palette intact.
- [ ] Typography and color palette strictly adhere to `DESIGN_SYSTEM.md`. No purple/blue AI gradient clichés.

## 3. Deployment & Production
- [ ] `npm run build` succeeds with zero TypeScript or styling errors.
- [ ] Deployed public URL accessible without authentication walls or missing assets.
- [ ] Browser console has zero uncaught exceptions.
