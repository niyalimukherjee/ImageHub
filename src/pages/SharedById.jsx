// src/pages/SharedById.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SharedById() {
  const { id } = useParams();
  const [img, setImg] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/images/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setImg(data);
      })
      .catch((e) => {
        console.error(e);
        setErr("Failed to load image");
      });
    return () => (mounted = false);
  }, [id]);

  if (err) return <div className="p-8 text-red-600">{err}</div>;
  if (!img) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded shadow p-4">
        <img src={img.imageUrl || img.url} alt={img.title} className="w-full object-contain" />
        <h1 className="text-xl font-semibold mt-4">{img.title}</h1>
        <p className="text-gray-600 mt-2">{img.description}</p>
      </div>
    </div>
  );
}
