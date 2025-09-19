// src/components/ImageCard.jsx
import React from "react";

export default function ImageCard({ img, onOpen }) {
  // support a few possible field names
  const src = img?.imageUrl ?? img?.url ?? img?.src ?? img?.thumbnail ?? "";

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onOpen?.(img)}
      style={{ minHeight: 220, display: "flex", flexDirection: "column" }}
    >
      <div style={{ width: "100%", height: 180, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {src ? (
          <img
            src={src}
            alt={img.title || "image"}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => {
              // fallback to placeholder if image fails to load
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.png"; // add a placeholder in public folder
            }}
          />
        ) : (
          <div style={{ color: "#9ca3af", fontSize: 14 }}>No preview</div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1">{img.title ?? "Untitled"}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{img.description}</p>

        {Array.isArray(img.categories) && img.categories.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {img.categories.map((c) => (
              <span key={c} className="text-xs px-2 py-1 bg-gray-100 rounded-full">{c}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
