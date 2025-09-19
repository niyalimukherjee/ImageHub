// src/pages/Gallery.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPublicImages } from "../lib/apiClient"; // ensure path matches
import Header from "../components/Header";
import ImageCard from "../components/ImageCard";
import Lightbox from "../components/LightBox";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState("");
  const [openImg, setOpenImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchPublicImages()
      .then((data) => {
        if (!mounted) return;
        // backend may return array or object; ensure array
        if (Array.isArray(data)) setImages(data);
        else if (data && Array.isArray(data.images)) setImages(data.images);
        else setImages([]);
      })
      .catch((err) => {
        console.error("Failed to fetch public images:", err);
        if (mounted) setError(err.message || "Failed to load images");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // categories: flatten arrays safely and dedupe
  const categories = Array.from(
    new Set(
      images
        .flatMap((i) => (Array.isArray(i.categories) ? i.categories : []))
        .map((c) => c?.trim())
        .filter(Boolean)
    )
  );

  const filtered = filter
    ? images.filter((i) => Array.isArray(i.categories) && i.categories.includes(filter))
    : images;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold">Discover</h2>

          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <Link to="/upload" className="px-3 py-2 bg-blue-600 text-white rounded-md">
              Upload
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading images…</div>
        ) : error ? (
          <div className="py-12 text-center text-red-600">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-600">No images found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((img) => (
              <ImageCard
                key={img._id ?? img.id}
                img={img}
                onOpen={() => setOpenImg(img)}
              />
            ))}
          </div>
        )}
      </div>

      <Lightbox open={!!openImg} img={openImg} onClose={() => setOpenImg(null)} />
    </div>
  );
}
