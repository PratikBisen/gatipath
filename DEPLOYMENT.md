# DEPLOYMENT GUIDE — GatiPath

## 1. Live Deployment Details
- **Live Public URL**: [https://pratikbisen.github.io/gatipath/](https://pratikbisen.github.io/gatipath/)
- **GitHub Repository**: [https://github.com/PratikBisen/gatipath](https://github.com/PratikBisen/gatipath)
- **Deployment Platform**: GitHub Pages (Branch: `gh-pages`)
- **Routing Strategy**: HashRouter for 100% static host compatibility and reliable reload support
- **Build Output**: `dist/` with relative base asset paths (`./`)

## 2. Demonstration Access & Personas
| Persona | Email | Purpose & Path |
|---|---|---|
| **Demo Student (Aarav Sharma)** | `student@gatipath.demo` | Experience student learning journey: Study Desk -> Focus Module -> Misconception Guidance -> Assessment |
| **Demo Teacher (Sunita Verma)** | `teacher@gatipath.demo` | Experience teacher command center: Casebook Dossier, Student Ledger, Diagnostic Analytics, Interventions |

*Note: The top masthead includes a 1-click persona switcher and a "Reset Demo" button.*

## 3. Verified Build & Production Metrics
- **Production JS**: `assets/index-BqmKS6OS.js` (441 kB raw, 122 kB gzipped)
- **Production CSS**: `assets/index-BxJfmQny.css` (50.6 kB raw, 9.4 kB gzipped)
- **HTTP Status**: Verified `HTTP/2 200 OK` on live GitHub Pages CDN.
- **Automated Tests**: 8 of 8 Vitest unit tests passing.

## 4. Visual Quality Inspection & Screenshots
Real browser screenshots captured at both Desktop (1440 × 900) and Mobile (390 × 844) resolutions are stored under:
- `docs/screenshots/before/`: Initial prototype state
- `docs/screenshots/after/`: Academic Atelier redesigned state
