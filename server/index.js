import cors from "cors";
import express from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { nanoid } from "nanoid";

import { ensureFontsRegistered } from "./lib/fonts.js";
import { generatePfpFrame, generateBuilderCard, escapeXml } from "./lib/render.js";
import { generateBuilderTitle } from "./lib/titles.js";

ensureFontsRegistered();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "generated");
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");
mkdirSync(GENERATED_DIR, { recursive: true });

const PORT = process.env.PORT || 8787;

const app = express();
app.set("trust proxy", true); // so req.protocol reflects x-forwarded-proto behind Render's proxy
app.use(cors());
app.use(express.json());

// Absolute base URL for this request. Prefers PUBLIC_BASE_URL if explicitly
// set (e.g. to pin a custom domain); otherwise derives it from the request,
// so share links and OG image URLs are correct immediately after deploy
// with zero manual config.
function baseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|heic|heif)$/i.test(file.mimetype) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.originalname || "");
    cb(ok ? null : new Error("Unsupported file type. Please upload a JPG, PNG, WEBP or HEIC photo."), ok);
  },
});

function metaPath(id) {
  return path.join(GENERATED_DIR, `${id}.json`);
}
function imagePath(id) {
  return path.join(GENERATED_DIR, `${id}.png`);
}

app.post("/api/generate", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No photo uploaded." });
    }
    const format = req.body.format === "card" ? "card" : "frame";
    const name = (req.body.name || "").toString().trim().slice(0, 60);
    const role = (req.body.role || "").toString().trim().slice(0, 60);

    if (format === "card" && !name) {
      return res.status(400).json({ error: "Name is required for the builder ID card." });
    }

    const id = nanoid(10);
    let buffer;
    let title = null;

    if (format === "frame") {
      buffer = await generatePfpFrame(req.file.buffer);
    } else {
      title = generateBuilderTitle(`${name}${role}`);
      buffer = await generateBuilderCard({ photoBuffer: req.file.buffer, name, role, title, id });
    }

    writeFileSync(imagePath(id), buffer);
    writeFileSync(
      metaPath(id),
      JSON.stringify({ id, format, name, role, title, createdAt: Date.now() })
    );

    const base = baseUrl(req);
    res.json({
      id,
      imageUrl: `${base}/images/${id}.png`,
      shareUrl: `${base}/share/${id}`,
    });
  } catch (err) {
    console.error("generate error:", err);
    const message = /unsupported image format|heif|input buffer/i.test(err.message || "")
      ? "Couldn't read that photo. Try a JPG or PNG."
      : err.message || "Something went wrong generating your graphic.";
    res.status(500).json({ error: message });
  }
});

app.get("/images/:id.png", (req, res) => {
  const file = imagePath(req.params.id);
  if (!existsSync(file)) return res.status(404).send("Not found");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(readFileSync(file));
});

app.get("/share/:id", (req, res) => {
  const id = req.params.id;
  const imgFile = imagePath(id);
  if (!existsSync(imgFile)) return res.status(404).send("This graphic doesn't exist (or has expired).");

  let meta = { format: "frame", name: "" };
  try {
    meta = JSON.parse(readFileSync(metaPath(id), "utf8"));
  } catch {
    // ok, fall back to defaults
  }

  const imageUrl = `${baseUrl(req)}/images/${id}.png`;
  const title = meta.format === "card" && meta.name
    ? `${escapeXml(meta.name)} is building at HH Goa 2026`
    : "I'm in for HH Goa 2026";
  const desc = "Made with the HH Goa 2026 Frame Generator. #FrameInGoa";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="${imageUrl}"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${desc}"/>
<meta name="twitter:image" content="${imageUrl}"/>
<style>
  body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;background:#14110F;font-family:-apple-system,Inter,sans-serif;padding:32px;box-sizing:border-box;}
  img{max-width:min(420px,90vw);width:100%;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.5);}
  a{background:#E8B23D;color:#14110F;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:999px;font-family:-apple-system,Inter,sans-serif;}
  p{color:#9A8F7A;font-size:14px;}
</style>
</head>
<body>
  <img src="${imageUrl}" alt="${title}"/>
  <a href="/">Make your own →</a>
  <p>#FrameInGoa</p>
</body>
</html>`);
});

// Serve built React frontend (production)
if (existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^(?!\/api|\/images|\/share).*/, (_req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

// Handles multer errors (bad file type, file too large) and any other error
// passed via next(err) from the routes above, so clients always get JSON
// instead of an HTML stack trace.
app.use((err, _req, res, next) => {
  if (!err) return next();
  console.error("request error:", err.message);
  const message = err.code === "LIMIT_FILE_SIZE"
    ? "That photo is too large (max 15MB)."
    : err.message || "Something went wrong.";
  res.status(400).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`HH Goa 2026 Frame Generator server running on port ${PORT}`);
});
