# PRODUCT REQUIREMENTS — GatiPath

## 1. Functional Scope

### A. Student Experience
- **Authentication**: Demo student login (`student@gatipath.demo` / password or instant one-click switcher) with credential validation and role-based routing.
- **Dashboard**:
  - Greeting with student name.
  - Current topic indicator with clear call-to-action ("Continue Learning").
  - Overall progress across curriculum topics.
  - Recommended next activity with transparent explanation badge.
  - Real recorded activity streak and history.
- **Learn Mode**:
  - Topic concept breakdown written for ages 11–13.
  - Interactive SVG visual fraction models (bars, circles, grids).
  - Step-by-step worked solutions with callout notes.
  - Direct bridge to practice ("Solve").
- **Solve Mode (Adaptive Practice)**:
  - Curated, mathematically verified questions.
  - Real-time evaluation against misconceptions (e.g. `denominator_addition_error`).
  - Scaffolding hint button (lowers score credit to 70 for hint-assisted solutions).
  - Clear explanations highlighting the mathematical reason, not just tick/cross.
  - Immediate difficulty adaptation based on performance window.
- **Test Mode (Summative Assessment)**:
  - Separate timed or un-scaffolded assessment mode (no hints allowed).
  - Multi-question navigation and submission.
  - Comprehensive results: score breakdown, concepts mastered vs needing support, next steps.
- **Learning Path**:
  - Interactive prerequisite DAG visualization.
  - Status indicators: Completed, In Progress, Locked, Recommended.

### B. Teacher Experience
- **Authentication**: Demo teacher login (`teacher@gatipath.demo`) with class view authorization.
- **Class Dashboard**:
  - Class summary metrics (total students, needing attention, progressing well, top learning gaps).
  - Distribution of class mastery across curriculum topics.
  - Real-time student activity feed.
- **Student Roster & Detail View**:
  - Topic-wise mastery breakdown (0–100 score).
  - Attempt log with submitted answers, hint usage, time taken, and detected misconceptions.
  - Explanation of engine recommendations for this student.
  - Teacher intervention manager: assign targeted revision or remedial tasks, add notes, mark interventions completed.
- **Class Insights**:
  - Class-wide misconception frequency analysis.
  - Topic difficulty ranking based on actual attempt data.
  - Grouping of students needing prerequisite review vs advanced extension.

### C. Adaptive Engine (Deterministic Rule-Based)
- **Mastery Formula**: Exponential moving average:
  `new_mastery = (old_mastery * 0.7) + (attempt_score * 0.3)`
  - Independent correct answer = 100
  - Correct answer after hint = 70
  - Incorrect answer = 0
- **Misconception Detection**: Explicit mapping for known student errors (e.g., 1/4 + 1/4 = 2/8 -> `denominator_addition_error`).
- **Recommendation Priority**:
  1. If repeated misconception detected -> Recommend targeted visual explanation and concept remedial.
  2. If prerequisite mastery < 70 -> Recommend prerequisite topic practice.
  3. If recent performance < 50% -> Reduce difficulty & offer guided practice.
  4. If performance >= 80% over 4+ independent items -> Increase difficulty / unlock assessment.
  5. Default -> Continue current practice.
- **Explanations**: All recommendations generate human-readable justifications.

## 2. Non-Functional Requirements
- **Performance**: Instant load, <100ms response time on mobile devices.
- **Responsiveness**: Tested from 360px mobile viewport up to 1440px desktop.
- **Data Integrity**: Full persistence via client database / IndexedDB with SQL migration parity, export, and reset-demo capability.
- **Zero Anti-AI-Slop**: Academic restrained palette, no random purple/blue gradients, no fake statistics, no fake LLM chatbots.
