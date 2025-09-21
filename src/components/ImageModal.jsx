// src/components/ImageModal.jsx
import React, { useEffect, useState } from "react";

/**
 * Frontend-only ImageModal
 * - Public images => share: /share/id/<imageId>
 * - Private images => inline share: /share/inline/<base64(JSON { url, title, description, ts })>
 *
 * NOTE: inline links are not secure or revocable. They embed image URL in the link itself.
 */
export default function ImageModal({ img, open, onClose, showShareControls = true }) {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");

  const frontendBase = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

  useEffect(() => {
    setError("");
    if (!img) {
      setShareUrl("");
      return;
    }
    // If img already has a client-side shareUrl saved in-memory or passed in, you could set here.
    setShareUrl("");
  }, [img]);

  // Build a public share link that points to frontend route by id
  function buildPublicShareLink() {
    return `${frontendBase.replace(/\/$/, "")}/share/id/${encodeURIComponent(img._id ?? img.id)}`;
  }

  // Build an inline frontend-only share link that encodes the imageUrl + metadata
  function buildInlineShareLink() {
    try {
      const payload = {
        url: img.imageUrl ?? img.url ?? img.src ?? "",
        title: img.title ?? "",
        description: img.description ?? "",
        ts: Date.now(),
      };
      const json = JSON.stringify(payload);
      // base64 encode - use btoa; Node buffers won't be available in browser
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(json))) : Buffer.from(json).toString("base64");
      return `${frontendBase.replace(/\/$/, "")}/share/inline/${encodeURIComponent(b64)}`;
    } catch (e) {
      console.error("Failed to build inline share link", e);
      return "";
    }
  }

  function handleGenerate() {
    setError("");
    setLoading(true);
    try {
      if (img.isPublic) {
        const url = buildPublicShareLink();
        setShareUrl(url);
      } else {
        // Private -> produce inline link (not secure, not revocable)
        const url = buildInlineShareLink();
        setShareUrl(url);
      }
    } catch (e) {
      setError("Failed to generate link");
    } finally {
      setLoading(false);
    }
  }

  function handleRevoke() {
    // Frontend-only: revocation is just clearing the UI (link may already be copied out)
    setShareUrl("");
    setError("");
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard");
    } catch (e) {
      console.error("copy failed", e);
      setError("Unable to copy link — please copy manually.");
    }
  }

  if (!open || !img) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: 900,
          background: "white",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderBottom: "1px solid #eee" }}>
          <img
            src={img.imageUrl || img.url || img.src || "/placeholder.png"}
            alt={img.title}
            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.png"; }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{img.title || "Untitled"}</div>
            <div style={{ fontSize: 13, color: "#555" }}>{img.description || ""}</div>
          </div>
          <button onClick={onClose} style={{ padding: 8, border: "none", background: "transparent", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa" }}>
            <img
              src={img.imageUrl || img.url || img.src || "/placeholder.png"}
              alt={img.title}
              style={{ maxWidth: "100%", maxHeight: 520, objectFit: "contain" }}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.png"; }}
            />
          </div>

          <div style={{ width: 320, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: "#777" }}>Categories</div>
              <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(img.categories || []).map((c) => (
                  <span key={c} style={{ fontSize: 12, padding: "6px 8px", background: "#f3f4f6", borderRadius: 999 }}>{c}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, color: "#777" }}>Details</div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#444" }}>Uploaded: {img.createdAt ? new Date(img.createdAt).toLocaleString() : "—"}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#444" }}>Owner: {img.ownerName || img.owner || "—"}</div>
            </div>

            {showShareControls && (
              <div style={{ marginTop: "auto" }}>
                {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

                {shareUrl ? (
                  <>
                    {shareUrl.includes("/share/inline/") && (
                      <div style={{ color: "#b45309", fontSize: 12, marginBottom: 8 }}>
                        ⚠️ Inline link embeds the image URL in the link itself. It is not revocable and should not be used for sensitive/private content.
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="text" value={shareUrl} readOnly onClick={(e) => e.currentTarget.select()}
                        style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13 }} />
                      <button onClick={copyLink} style={{ padding: "8px 10px", borderRadius: 6, background: "#111827", color: "white", border: "none" }}>Copy</button>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <a href={shareUrl} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", padding: "8px 10px", borderRadius: 6, background: "#10b981", color: "white", textDecoration: "none" }}>Open</a>
                      <button onClick={handleRevoke} style={{ padding: "8px 10px", borderRadius: 6, background: "#ef4444", color: "white", border: "none" }}>Revoke</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: "#6b7280", marginBottom: 8 }}>
                      {img.isPublic ? "This is a public image — share the public page link." : "This is a private image — generate an inline frontend-only link (not secure)."}
                    </div>
                    <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", padding: "10px 12px", borderRadius: 6, background: "#3b82f6", color: "white", border: "none" }}>
                      {loading ? "Generating..." : "Get Share Link (frontend-only)"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
