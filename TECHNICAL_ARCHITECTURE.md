# TECHNICAL ARCHITECTURE — GatiPath

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Client Layer (SPA)                     │
│  React 18 + TypeScript + Vite + Tailwind CSS + Lucide    │
│  React Router v6 + Responsive Mobile Shell               │
└────────────────────────────┬─────────────────────────────┘
                             │
     ┌───────────────────────┴───────────────────────┐
     ▼                                               ▼
┌───────────────────────────┐         ┌───────────────────────────┐
│   Adaptive Engine (TS)    │         │  Repository & Store Layer │
│  - Mastery Calculator     │         │  - Normalized Data Store  │
│  - Misconception Evaluator│◄───────►│  - Role-based Auth State  │
│  - Prerequisite Graph     │         │  - IndexedDB / LocalStore │
│  - Recommendation Engine  │         │  - Supabase Sync Client   │
└───────────────────────────┘         └──────────────┬────────────┘
                                                     │
                                                     ▼
                                      ┌───────────────────────────┐
                                      │   PostgreSQL / Supabase   │
                                      │  (Migrations & Seed SQL)  │
                                      └───────────────────────────┘
```

## 2. Directory Layout
```
gatipath/
├── src/
│   ├── app/
│   │   ├── App.tsx             # Root layout & providers
│   │   └── routes.tsx          # Route definitions & guards
│   ├── components/
│   │   ├── layout/             # Shell, headers, mobile navigation
│   │   ├── ui/                 # Buttons, badges, cards, tabs, inputs
│   │   ├── visuals/            # Mathematical SVG fraction renderers
│   │   └── charts/             # Lightweight SVG data charts
│   ├── engine/
│   │   ├── types.ts            # Adaptive engine types
│   │   ├── mastery.ts          # EMA mastery updates
│   │   ├── misconceptions.ts   # Misconception catalog & evaluator
│   │   ├── prerequisites.ts    # Graph traversal & readiness checks
│   │   ├── recommendation.ts   # Rule-based next action generator
│   │   └── difficulty.ts       # Dynamic item selector
│   ├── data/
│   │   ├── curriculum/         # Class 7 Fractions data (4 topics)
│   │   └── seed/               # Demo students (Aarav, Priya, Rohan, etc.)
│   ├── lib/
│   │   ├── db/                 # Relational persistent store & repos
│   │   ├── auth/               # Role-based context (Student / Teacher)
│   │   └── utils/              # Math & formatting utilities
│   ├── features/
│   │   ├── auth/               # Login & role switcher
│   │   ├── student/            # Dashboard, learning path, progress
│   │   ├── learning/           # Learn screen, Solve screen with feedback
│   │   ├── assessments/        # Summative assessment test runner
│   │   └── teacher/            # Roster, class insights, student detail, interventions
│   └── tests/                  # Unit tests for adaptive engine
├── supabase/
│   └── migrations/             # Standard PostgreSQL DDL & seeds
├── public/                     # Icons, manifest
└── package.json
```

## 3. Data Integrity & Resilience
- **Deterministic State**: State is preserved across page reloads via IndexedDB/LocalStorage with automatic hydration.
- **SQL Schema Parity**: Data types mirror the PostgreSQL schema directly.
- **Reset Functionality**: Instant one-click "Reset Demo Data" restores the reference demo state (Aarav at initial stage, Priya advanced, Rohan struggling with equivalent fractions).
