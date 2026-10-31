# DEPLOYMENT GUIDE — GatiPath

## 1. Hosting Architecture
- **Application Type**: Static Single Page Application (SPA) with client-side relational persistence and optional Supabase backend synchronization.
- **Frontend Host**: Vercel / GitHub Pages / Netlify.
- **Node Version**: v24.22.2 (LTS compatible).
- **Package Manager**: npm 11.19.1.

## 2. Environment Variables
- `VITE_APP_TITLE`: GatiPath
- `VITE_SUPABASE_URL`: (Optional) Remote Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: (Optional) Public client anonymous key

## 3. Build & Deployment Commands
- **Install dependencies**: `npm install`
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview`
- **Deploy to Vercel**: `npx -y vercel --prod`
- **Deploy to GitHub Pages**: `npm run deploy` via `gh-pages` or GitHub Actions

## 4. Verification Steps Post-Deployment
1. Open the live URL.
2. Sign in as Demo Student (`student@gatipath.demo`).
3. Complete practice session in "Addition & Subtraction" and confirm adaptive engine responses.
4. Sign in as Demo Teacher (`teacher@gatipath.demo`).
5. Open student profile for "Aarav Sharma" and verify logged attempts and interventions.
6. Verify responsive display on mobile viewport.
