import { useCallback, useRef, useState } from "react";

const LOADING_LABELS = {
  frame: "Compositing your frame…",
  card: "Laminating your badge…",
};

function useObjectUrl() {
  const urlRef = useRef(null);
  const set = useCallback((file) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = file ? URL.createObjectURL(file) : null;
    return urlRef.current;
  }, []);
  return set;
}

export default function App() {
  const [format, setFormat] = useState("frame");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { id, imageUrl, shareUrl }
  const fileInputRef = useRef(null);
  const setObjectUrl = useObjectUrl();

  function handleFile(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setPhotoFile(file);
    setPhotoPreview(setObjectUrl(file));
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function resetPhoto() {
    setPhotoFile(null);
    setPhotoPreview(setObjectUrl(null));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function resetAll() {
    setResult(null);
    setError(null);
    resetPhoto();
    setName("");
    setRole("");
  }

  async function handleGenerate() {
    if (!photoFile) {
      setError("Upload a photo first.");
      return;
    }
    if (format === "card" && !name.trim()) {
      setError("Add your name for the ID card.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const body = new FormData();
      body.append("photo", photoFile);
      body.append("format", format);
      if (format === "card") {
        body.append("name", name.trim());
        body.append("role", role.trim());
      }
      const res = await fetch("/api/generate", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!result) return;
    const res = await fetch(result.imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hh-goa-2026-${format}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    if (!result) return;
    const caption = "I'm building at HH Goa 2026 🌴 #FrameInGoa";
    try {
      const res = await fetch(result.imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "hh-goa-2026.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: caption });
        return;
      }
    } catch {
      // fall through to link-intent share below
    }
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(result.shareUrl)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="wordmark">HH GOA<span> · </span>2026</div>
        <div className="eyebrow-tag">FRAME GENERATOR</div>
      </header>

      <section className="hero">
        <h1>Show up as a <em>builder.</em></h1>
        <p>
          Upload a photo. Get a branded HH Goa 2026 graphic back in seconds —
          ready to download and post on X.
        </p>
      </section>

      <div className="ticket-panel">
        <div className="ticket-stub">
          <span className="stub-text">GOA, IN</span>
          <span className="hole" />
          <span className="stub-text">2026</span>
        </div>

        <div className="panel-body">
          {result ? (
            <div className="result">
              <img src={result.imageUrl} alt="Your generated HH Goa 2026 graphic" />
              <div className="result-actions">
                <button className="btn btn-primary" onClick={handleShare}>
                  Share to X
                </button>
                <button className="btn btn-secondary" onClick={handleDownload}>
                  Download image
                </button>
                <button className="btn btn-ghost" onClick={resetAll}>
                  Make another
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="format-tabs">
                <button
                  className={format === "frame" ? "active" : ""}
                  onClick={() => setFormat("frame")}
                >
                  PFP Frame
                </button>
                <button
                  className={format === "card" ? "active" : ""}
                  onClick={() => setFormat("card")}
                >
                  Builder ID Card
                </button>
              </div>

              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Selected" />
                  <button onClick={resetPhoto}>Change</button>
                </div>
              ) : (
                <label
                  className={`dropzone${dragActive ? " drag-active" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={onDrop}
                >
                  <div className="dz-title">Drop a photo, or tap to choose</div>
                  <div className="dz-sub">JPG, PNG, WEBP or HEIC</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </label>
              )}

              {format === "card" && (
                <>
                  <div className="field">
                    <label>Name</label>
                    <input
                      value={name}
                      maxLength={60}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sankho Bhattacharyya"
                    />
                  </div>
                  <div className="field">
                    <label>Stack / role (optional)</label>
                    <input
                      value={role}
                      maxLength={60}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="@handle · Full-Stack"
                    />
                  </div>
                </>
              )}

              {error && <div className="error-msg">{error}</div>}

              <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    {LOADING_LABELS[format]}
                  </>
                ) : (
                  "Generate my graphic"
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="footer-note">#FRAMEINGOA — NO SIGNUP REQUIRED</div>
    </div>
  );
}
