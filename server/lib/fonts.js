import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUNDLED_FONTS_DIR = path.join(__dirname, "..", "assets", "fonts");

// Fonts are bundled as static-weight TTFs (see assets/fonts) so librsvg/fontconfig
// resolve them predictably. At boot we copy them into the per-user fontconfig
// scan path and rebuild the cache. This has to run once before any SVG with
// custom font-family names is rasterized by sharp.
export function ensureFontsRegistered() {
  const target = path.join(homedir(), ".local", "share", "fonts");
  mkdirSync(target, { recursive: true });

  const files = readdirSync(BUNDLED_FONTS_DIR).filter((f) => f.endsWith(".ttf"));
  for (const file of files) {
    const dest = path.join(target, file);
    if (!existsSync(dest)) {
      copyFileSync(path.join(BUNDLED_FONTS_DIR, file), dest);
    }
  }

  try {
    execFileSync("fc-cache", ["-f", target], { stdio: "ignore" });
  } catch (err) {
    console.warn("fc-cache failed - custom fonts may fall back to system defaults:", err.message);
  }
}
