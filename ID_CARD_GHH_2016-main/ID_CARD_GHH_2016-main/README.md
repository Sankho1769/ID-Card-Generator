# 🌴 HH GOA 2026 — BUILDER ID GENERATOR ("Goa Builder Passport")

The official **Builder ID Generator** for the **Hacker House Goa 2026** shortlisting challenge. 

A high-performance, neo-brutalist retro-tropical web application that puts a face to the builder, turning developer profiles into collectible **1080 × 1350 px Goa Builder Passports** and **1600 × 900 px Crew Posters**.

---

## 🚀 Key Features

- **🏖️ Authentic HH Goa Brand Assets**: Hand-crafted compositions using official visual assets from `/assets` (Hacker House typography logo, Hindi Goa stamp, Sunrise rays, Goa coastal scenery, palm trees, and hand-drawn builder illustrations).
- **📸 Smart Photo Engine**:
  - Drag-and-drop / tap-to-upload support for `JPG`, `PNG`, `WEBP`, and real browser-side `HEIC`/`HEIF` conversion via `heic2any`.
  - Client-side auto-downscaling for 40MP+ mobile camera photos.
  - Interactive **Zoom** (`1.0x` to `3.0x`) and 2D **Pan (X/Y)** sliders.
- **⚡ Local Builder Title Generator**:
  - Deterministic & randomized title engine categorized across UI/UX, Frontend, React, Backend, AI, Mobile, DevOps, Web3, Fullstack, and General.
  - One-click `NEW TITLE ↻` button.
- **🎨 3 Distinct Visual Styles**:
  1. **Beach Club**: Deep Goa green dominant, yellow sun, palm foliage, coastal relaxed vibe.
  2. **Night Hacker**: Midnight forest / dark mode, hot pink frames, yellow highlights, sticker-heavy hacker energy.
  3. **Goa Sunset**: Golden hour sunset hues, sunrise backdrop, warm retro poster feel.
- **🎯 100% Consistent High-Res Canvas Rendering**:
  - **Single Builder ID**: High-DPI **1080 × 1350 px** portrait social format.
  - **Crew Mode ("The Crew")**: High-DPI **1600 × 900 px** landscape poster for 1 to 3 builders side-by-side.
  - Live preview and downloaded PNG are 100% pixel-matched.
- **💾 Real PNG Export & Instant Download**: Sanitized filename generation (e.g. `hh-goa-2026-joydip-acharjee.png`).
- **🐦 X (Twitter) Sharing (#FrameInGoa)**:
  - Dynamic X post generator with custom caption, `#FrameInGoa`, and `#HHGoa`.
  - Web Share API integration on mobile with direct PNG file attachment.
  - One-click direct image clipboard copying.
- **📱 100% Mobile Optimized & Zero Wall**:
  - Mobile-first touch controls, responsive down to 375px.
  - No login, no signup, no auth wall.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Neo-Brutalist CSS Tokens
- **Animations**: Framer Motion
- **State Management**: Zustand
- **File Handling**: React Dropzone + Dynamic `heic2any` (code-split)
- **Canvas Rendering**: Pure HTML5 2D Canvas API (High-DPI)
- **Icons**: Lucide React + Official SVG Asset Icons
- **Celebration Effects**: canvas-confetti

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production bundle locally**:
   ```bash
   npm run preview
   ```

---

## ☁️ Deployment to Vercel

This project is configured for one-click deployment to **Vercel**:

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the repository in the **Vercel Dashboard**.
3. Framework Preset: **Vite**
4. Root Directory: `./`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**!

No mandatory backend environment variables are required for the client-side passport & crew generator.
