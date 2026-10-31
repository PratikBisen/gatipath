# DESIGN SYSTEM — GatiPath (Academic Atelier Edition)

## 1. Visual Identity & Palette
An academic, editorial workspace aesthetic designed for Indian classrooms, replacing conventional SaaS dashboards with open information architecture, bookbinding rules, and high-contrast editorial typography.

| Role | Color Name | Hex Code | Purpose / Usage |
|---|---|---|---|
| Main Background | Natural Parchment | `#FBF9F5` | Calming, warm reading & learning surface |
| Sub-Surface / Ticker | Warm Bone / Alabaster | `#FAF7F2` | Secondary headers, ticker background, table headers |
| Card / Dossier Surface | Pure Paper White | `#FFFFFF` | Isolated reading focus cards and modals |
| Hairline Borders | Bookbinding Stone | `#E8E2D8` / `#E0D8CC` | Fine rules, open ledger table dividers |
| Primary Ink | Deep Obsidian Ink | `#1A1817` | Editorial serif headings, bold data points |
| Muted Ink | Editorial Graphite | `#5C5549` / `#7A7265` | Subtitles, descriptions, section meta |
| Tertiary Ink | Annotation Stone | `#9C958C` | Captions, roll numbers, timestamp offsets |
| Primary Heritage | British Forest / Laurel | `#1B4332` | Key actions, certified mastery badges, focus states |
| Accent Ochre | Academic Saffron | `#C57D36` | Active diagnostic sparks, warnings, thresholds |
| Gap / Severity | Terracotta Crimson | `#8C2828` | Flagged misconceptions, critical prerequisite gaps |

## 2. Editorial Typography
- **Display & Section Titles**: `Newsreader` (Google Fonts, serif with optical sizing). Evokes serious scholarly research and editorial elegance.
- **Body & Controls**: `Plus Jakarta Sans` / `Inter` (sans-serif). Clean, hyper-legible geometric grotesque.
- **Data & Ledger Notation**: `JetBrains Mono` (monospace). Tabular numerals, roll numbers, percentages, mathematical notation.
- **Scale Hierarchy**:
  - Main Display Masthead: 36px–48px (`font-editorial font-bold tracking-tight`)
  - Section Headings: 20px–28px (`font-editorial font-bold`)
  - Ledger & Table Headers: 10px–11px (`font-mono uppercase tracking-widest`)
  - Body Text: 13px–15px (`text-xs sm:text-sm leading-relaxed`)

## 3. Open Information Architecture (No "Cards Everywhere")
- **Top Academic Folio Bar**: A full-width academic masthead with institution metadata, persona switcher, reset action, and numbered workspace navigation (`01 Command Dossier`, `02 Scholar Ledger`, `03 Diagnostic Analytics`, `04 Interventions`).
- **Open Ledger Tickers**: Metric summaries presented as horizontal editorial tickers divided by vertical hairline rules (`1px solid #E8E2D8`) rather than isolated rounded boxes.
- **Asymmetrical Split Compositions**:
  - Teacher view: 68% Instructional Casebook + 32% Pedagogical Briefing note & live attempt stream.
  - Student view: Dedicated Study Focus Atelier + Open Curriculum Roadmap + Study Journal.
- **Refined Data Ledger**: Generous row heights, serif scholar monograms, and color-coded topic progress pills.

## 4. Mobile Ergonomics (390px × 844px Verified)
- Bottom mobile dock with 4 touch targets (Study, Journey, Assess for Student; Overview, Roster, Insights, Actions for Teacher).
- Compact mobile header hiding verbose subtitles and displaying truncated first-name persona pills to eliminate horizontal crowding.
- Touch target minimum: 44px × 44px.
