// src/components/ImageCard.jsx
import React, { useState, useEffect } from "react";

/**
 * ImageCard
 *
 * Props:
 *  - img: image object (expects at least _id / id and imageUrl fields)
 *  - onOpen: optional callback when card clicked (onOpen(img))
 *  - showShareControls: boolean (default false) - show "Get Share Link / Revoke" controls
 *  - onShareChange: optional callback called with updated image when shareLink changes
 */
export default function ImageCard({ img, onOpen, showShareControls = false, onShareChange }) {
  const src = img?.imageUrl ?? img?.url ?? img?.src ?? img?.thumbnail ?? "";
  const id = img?._id ?? img?.id;
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Build full frontend URL when we have shareLink stored on the image
  useEffect(() => {
    if (img?.shareLink) {
      const frontend = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
      setShareUrl(`${frontend}/share/${img.shareLink}`);
    } else {
      setShareUrl("");
    }
  }, [img?.shareLink]);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function generateShareLink() {
    if (!id) return setErr("Invalid image id");
    setErr("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/images/${id}/share`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || JSON.stringify(data));
      // Server returned { shareUrl } — but image also updated on backend; call callback if provided
      setShareUrl(data.shareUrl);
      onShareChange?.({ ...img, shareLink: img.shareLink ?? data.shareUrl?.split("/").pop() });
    } catch (error) {
      console.error("generateShareLink err:", error);
      setErr(error.message ?? "Failed to generate link");
    } finally {
      setLoading(false);
    }
  }

  async function revokeShareLink() {
    if (!id) return setErr("Invalid image id");
    setErr("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/images/${id}/share`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || JSON.stringify(data));
      setShareUrl("");
      onShareChange?.({ ...img, shareLink: null });
    } catch (error) {
      console.error("revokeShareLink err:", error);
      setErr(error.message ?? "Failed to revoke link");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      // small friendly feedback - use alert for simplicity (you can replace with toast)
      /* eslint-disable no-alert */
      alert("Link copied to clipboard");
      /* eslint-enable no-alert */
    } catch (e) {
      console.error("copy failed", e);
      setErr("Copy failed — please copy manually");
    }
  }

  return (
    <div
      className="bg-[#fffdf8] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onOpen?.(img)}
      style={{ minHeight: 220, display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          width: "100%",
          height: 180,
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={img.title || "image"}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        ) : (
          <div style={{ color: "#9ca3af", fontSize: 14 }}>No preview</div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <div>
          <h3 className="font-semibold text-sm mb-1 text-gray-800">{img.title ?? "Untitled"}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{img.description}</p>

          {Array.isArray(img.categories) && img.categories.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {img.categories.map((c) => (
                <span key={c} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Share controls area (shown only when showShareControls === true) */}
        {showShareControls && (
          <div
            className="mt-3 pt-2"
            onClick={(e) => {
              // Prevent card click from firing when interacting with share controls
              e.stopPropagation();
            }}
          >
            {err && <div className="text-red-600 text-xs mb-2">{err}</div>}

            {/* If shareUrl exists (link generated), show it and copy/revoke buttons */}
            {shareUrl ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 text-sm px-2 py-1 border rounded"
                    value={shareUrl}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <button
                    onClick={copyToClipboard}
                    className="text-sm px-3 py-1 bg-gray-800 text-white rounded"
                    title="Copy share link"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={revokeShareLink}
                    disabled={loading}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded"
                  >
                    {loading ? "Revoking..." : "Revoke Link"}
                  </button>

                  {/* Quick quick-view button that opens the share link in new tab */}
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Open
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={generateShareLink}
                  disabled={loading}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
                >
                  {loading ? "Generating..." : "Get Share Link"}
                </button>

                {/* If image is public, show a hint that it's already accessible publicly (optional) */}
                {img?.isPublic ? (
                  <div className="text-xs text-gray-600 self-center">
                    Public image — can be shared via its public page
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 self-center">Private — create share link</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
