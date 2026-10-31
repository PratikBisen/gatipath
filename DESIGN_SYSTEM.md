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
- **Elevation / Shadows**: Very subtle (`shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`). No heavy drop-shadows.
- **Borders**: 1px solid `#E4E8E2`, radius `rounded-lg` (8px) or `rounded-xl` (12px). No cartoonishly oversized pill buttons.
- **Iconography**: Lucide React icons exclusively with 1.75px stroke width. Never use emojis as interface icons.
- **Visual Representations**: SVG-rendered fraction models (bar representations, circular fraction pies, grid models).

## 4. Mobile Ergonomics
- Minimum touch target: 44px x 44px.
- Bottom navigation bar on viewports < 768px for immediate one-thumb accessibility.
- Sticky action bars on mobile practice screens so submission is never hidden below fold.
