// src/components/Lightbox.jsx
import React from "react";

export default function Lightbox({ open, img, onClose }) {
  if (!open || !img) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div className="max-w-4xl max-h-[90vh] w-full p-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-lg overflow-hidden">
          <img src={img.url} alt={img.title} className="w-full h-auto max-h-[75vh] object-contain bg-gray-100" />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{img.title}</h3>
            {img.description && <p className="text-sm text-gray-600 mt-2">{img.description}</p>}
            <div className="mt-3 flex items-center gap-2">
              {img.categories?.map(c => <span key={c} className="text-xs bg-gray-100 px-2 py-1 rounded">{c}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
