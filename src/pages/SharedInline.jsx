// src/pages/SharedInline.jsx
import React from "react";
import { useParams } from "react-router-dom";

function safeB64Decode(b64) {
  try {
    const decoded = decodeURIComponent(escape(atob(b64)));
    return decoded;
  } catch (e) {
    // fallback for environments lacking atob/unescape
    try {
      return Buffer.from(decodeURIComponent(b64), "base64").toString("utf8");
    } catch (err) {
      console.error("b64 decode error", err);
      return null;
    }
  }
}

export default function SharedInline() {
  const { payload } = useParams();
  let json = null;
  try {
    const raw = safeB64Decode(decodeURIComponent(payload));
    json = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to decode inline share payload", e);
  }

  if (!json) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <h2 className="text-xl font-bold mb-4">Invalid or corrupted share link</h2>
          <p className="text-gray-600">The link appears to be invalid. Make sure it was copied completely.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded shadow p-4">
          <img src={json.url} alt={json.title} className="w-full object-contain" />
          <h1 className="text-xl font-semibold mt-4">{json.title}</h1>
          <p className="text-gray-600 mt-2">{json.description}</p>
        </div>
      </div>
    </div>
  );
}
