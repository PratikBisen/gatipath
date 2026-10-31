# DEPLOYMENT GUIDE — GatiPath

## 1. Live Deployment Details
- **Live Public URL**: [https://pratikbisen.github.io/gatipath/](https://pratikbisen.github.io/gatipath/)
- **GitHub Repository**: [https://github.com/PratikBisen/gatipath](https://github.com/PratikBisen/gatipath)
- **Deployment Platform**: GitHub Pages (Branch: `gh-pages`)
- **Routing Strategy**: HashRouter for 100% static host compatibility and reliable reload support
- **Build Output**: `dist/` with relative base asset paths (`./`)

## 2. Demonstration Access & Accounts
| Persona | Email | Purpose |
|---|---|---|
| **Demo Student (Aarav Sharma)** | `student@gatipath.demo` | Experience student learning journey: Learn -> Solve -> Misconception Guidance -> Assessment |
| **Demo Teacher (Sunita Verma)** | `teacher@gatipath.demo` | Experience teacher command center: Class roster, student detail, diagnostics, interventions |

*Note: For instant evaluation, the top navbar includes a one-click persona switcher and a "Reset Demo Data" button.*

## 3. Build & Local Development
```bash
# Clone the repository
git clone https://github.com/PratikBisen/gatipath.git
cd gatipath

# Install dependencies
npm install

# Run automated tests
npm test

# Run local development server
npm run dev

# Build for production
npm run build
```

## 4. Verification Check
- Live HTTP/2 status: `200 OK`
- Assets status: `HTTP 200` for JS (`assets/index-DQK_KRLX.js`) and CSS (`assets/index-BD6R0nk5.css`)
- End-to-end user workflows verified.
