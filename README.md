# HH Goa 2026 — Frame Generator

Upload a photo, get back a branded HH Goa 2026 graphic — either a PFP frame
(for X) or a Builder ID Card — ready to download and share. No login.

- **Frontend:** React (Vite)
- **Backend:** Node/Express + [sharp](https://sharp.pixelplumbing.com/) for real server-side image compositing
- **Output:** actual downloadable PNG files, not a canvas-only preview
- **Sharing:** native share sheet (image attached) on mobile, falls back to a
  pre-filled X tweet-intent link whose OG preview shows the real graphic

## Deploy (Render, ~2 minutes)

1. Push this folder to a new GitHub repo.
2. Go to [Render](https://render.com) → **New** → **Blueprint**, and point it
   at your repo. Render will read `render.yaml` and `Dockerfile` automatically
   and deploy a single web service — no manual config needed.
   - (Alternatively: **New → Web Service**, pick "Docker" as the runtime,
     point it at the repo. Same result.)
3. Wait for the build to finish (~2-3 min the first time). You'll get a URL
   like `https://hh-goa-frame-generator.onrender.com` — that's your live link.

The app builds itself entirely from the `Dockerfile` — it installs
`fontconfig` in the image so the brand fonts (Space Grotesk / JetBrains Mono)
render correctly server-side, builds the React app, and starts the Express
server, which serves both the API and the built frontend from one process.

**Free-tier notes:**
- Render's free web services spin down after inactivity; the first request
  after idling takes ~30-50s to wake up. Fine for a shortlisting demo; upgrade
  the plan if you want it always warm.
- Generated images are stored on local disk (`server/generated/`), which is
  **ephemeral** on Render's free tier — it's wiped on redeploy/restart, but
  persists fine during normal operation. If you need images to survive
  restarts long-term, swap the disk writes in `server/index.js` for an object
  store (S3, Cloudinary, etc.) — the write/read is isolated to two spots
  (`imagePath`/`metaPath`) so it's a small change.

## Local development

Requires Node 20+.

```bash
# terminal 1 — backend (port 8787)
cd server
npm install
npm start

# terminal 2 — frontend (port 5173, proxies /api, /images, /share to :8787)
cd client
npm install
npm run dev
```

Open http://localhost:5173.

To test the production build locally:

```bash
cd client && npm install && npm run build
cd ../server && npm install && npm start
# open http://localhost:8787 — server serves the built client directly
```

## How it works

- `POST /api/generate` — multipart upload (`photo`, `format`: `frame`|`card`,
  optional `name`/`role` for the card) → composites the image with `sharp`,
  saves it, returns `{ id, imageUrl, shareUrl }`.
- `GET /images/:id.png` — serves the generated PNG.
- `GET /share/:id` — a lightweight HTML page with proper `og:image` /
  `twitter:image` tags, so pasting the link into X (or anywhere) shows the
  actual generated graphic as the link preview, not a blank/default card.
- Photo cropping uses libvips' `attention` strategy (`sharp`'s smart-crop) so
  off-center subjects are still framed reasonably without asking the user to
  pre-crop.
- Brand fonts are bundled as static-weight TTFs in `server/assets/fonts/` and
  registered with fontconfig at server boot (`server/lib/fonts.js`), which is
  why the Docker image installs `fontconfig` — without it, sharp's SVG
  rasterizer would silently fall back to a generic system font.

## Customizing the design

All colors/typography live as tokens at the top of `server/lib/render.js`
(server-generated graphics) and as CSS variables in `client/src/index.css`
(the web UI) — change them in one place to reskin.
