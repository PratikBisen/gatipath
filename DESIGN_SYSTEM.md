# DESIGN SYSTEM — GatiPath

## 1. Visual Identity & Palette
An academic, calm, trustworthy aesthetic designed for Indian schools.

| Role | Color Name | Hex Code | Purpose / Usage |
|---|---|---|---|
| Main Background | Canvas Ivory | `#F7F8F5` | Main page background |
| Primary Surface | Clean White | `#FFFFFF` | Cards, modals, containers |
| Primary Text | Deep Charcoal | `#202A25` | Headings, primary body text |
| Muted Text | Slate Moss | `#747D76` | Subtitles, labels, captions |
| Borders | Soft Stone | `#E4E8E2` | Dividers, card borders, table lines |
| Primary Green | Forest Academic | `#246B50` | Primary actions, success indicators, progress |
| Secondary Green | Mint Tint | `#DDEBE2` | Selected states, badge backgrounds |
| Accent Orange | Terracotta Warmth | `#C77A45` | Highlights, hints, learning markers |
| Warning | Ochre Alert | `#B87936` | Needs attention, review warnings |
| Error / Remedial | Crimson Coral | `#B94D45` | Misconceptions, incorrect answers, urgent support |

## 2. Typography
- **Primary Body & UI**: Inter (`font-sans`), weight 400 (regular), 500 (medium), 600 (semibold).
- **Display & Headings**: Inter / Manrope (`font-heading`), clean geometric sans with high legibility.
- **Scale**:
  - Display / H1: 24px–30px (desktop), 20px–24px (mobile)
  - H2: 18px–20px
  - H3: 15px–16px
  - Body: 14px (compact interface) / 15px (reading lessons)
  - Small / Badges: 12px–13px

## 3. UI Components & Tokens
- **Elevation / Shadows**:
  - `shadow-card`: `0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)`
  - `shadow-cardHover`: `0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)`
  - `shadow-popover`: `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)`
  - `shadow-floating`: `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`
- **Component Primitives**:
  - `Card`, `CardHeader`, `CardContent`, `CardFooter`: Structured containers with subtle borders and hover states.
  - `StatCard`: Standardized metric display with semantic icon backgrounds, trends, and secondary details.
  - `MasteryBadge`: Color-coded pill with glowing status dot (`Mastered`, `Practicing`, `Needs Support`, `Not Started`).
  - `StatusPill`: High-contrast pill for student status (`Needs Support`, `Advanced`, `On Track`) and intervention statuses (`Active`, `Completed`).
  - `ProgressBar`: 6px/8px high-precision progress track with optional 85% mastery threshold marker.
  - `Avatar`: Fallback monogram avatar with status indicator dot.
  - `SearchInput`: Debounced search box with keyboard shortcuts and clear action.
  - `Modal`: Accessible backdrop dialog with escape key dismissal.
- **Iconography**: Lucide React icons exclusively with 1.75px stroke width. Never use emojis as interface icons.
- **Visual Representations**: SVG-rendered fraction models (bar representations, circular fraction pies, grid models).

## 4. Mobile Ergonomics
- Minimum touch target: 44px x 44px.
- Bottom navigation bar on viewports < 768px for immediate one-thumb accessibility.
- Sticky action bars on mobile practice screens so submission is never hidden below fold.
