// src/pages/Gallery.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, Button, CircularProgress } from "@mui/material";

import { fetchPublicImages } from "../lib/apiClient";
import Header from "../components/Header";
import ImageCard from "../components/ImageCard";
// replaced Lightbox with ImageModal
import ImageModal from "../components/ImageModal";

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
    <div className="min-h-screen bg-[#FFFDD0]"> {/* Cream background */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">
            Discover
          </Typography>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
              <button
                onClick={() => setFilter("")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                  ${
                    filter === ""
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-200 text-gray-800 hover:bg-yellow-300"
                  }`}
              >
                All
              </button>

              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                    ${
                      filter === c
                        ? "bg-yellow-600 text-white"
                        : "bg-yellow-200 text-gray-800 hover:bg-yellow-300"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Upload button */}
            <Link to="/upload">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#D97706", // amber-600
                  "&:hover": { bgcolor: "#B45309" }, // darker amber
                  borderRadius: "9999px", // pill shape
                  textTransform: "none",
                  px: 3,
                  py: 1,
                }}
              >
                Upload
              </Button>
            </Link>
          </div>
        </div>

        {/* Content section */}
        {loading ? (
          <div className="flex justify-center py-20">
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography className="text-center text-red-600 py-12">
            Error: {error}
          </Typography>
        ) : filtered.length === 0 ? (
          <Typography className="text-center text-gray-600 py-12">
            No images found.
          </Typography>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {filtered.map((img) => (
              <div key={img._id ?? img.id} className="break-inside-avoid">
                {/* clicking image opens modal */}
                <ImageCard img={img} onOpen={() => setOpenImg(img)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ImageModal replaces Lightbox */}
      <ImageModal
        img={openImg}
        open={!!openImg}
        onClose={() => setOpenImg(null)}
        showShareControls={true}
        onShareChange={(updated) => {
          if (!updated || !updated._id) return;
          // update the images list (so cards reflect new shareLink)
          setImages((prev) => prev.map((it) => (it._id === updated._id ? { ...it, ...updated } : it)));
          // also update currently open image (modal content)
          setOpenImg((prev) => (prev && prev._id === updated._id ? { ...prev, ...updated } : prev));
        }}
      />
    </div>
  );
}
