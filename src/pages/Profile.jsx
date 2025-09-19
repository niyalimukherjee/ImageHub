// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { getCurrentUser, fetchMyImages } from "../lib/apiClient";
import Header from "../components/Header";
import ImageCard from "../components/ImageCard";
import Lightbox from "../components/LightBox";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);
  const [openImg, setOpenImg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoadingUser(true);
    getCurrentUser()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
      })
      .catch((err) => {
        console.warn("getCurrentUser failed:", err);
        setError("Not logged in");
        // redirect to login after a short delay
        setTimeout(() => navigate("/login"), 1000);
      })
      .finally(() => {
        if (mounted) setLoadingUser(false);
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    let mounted = true;
    setLoadingImages(true);
    fetchMyImages()
      .then((list) => {
        if (!mounted) return;
        setImages(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("fetchMyImages failed:", err);
        setError("Failed to load your images");
      })
      .finally(() => {
        if (mounted) setLoadingImages(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // If not logged in we already navigated away; show simple message while redirecting
  if (loadingUser) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading profile…</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-700">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username ?? "User"}</h1>
              <p className="text-sm text-gray-500">{user?.email ?? ""}</p>
            </div>
          </div>

          <div>
            <button
              onClick={() => navigate("/upload")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Upload new
            </button>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your uploads</h2>

          {loadingImages ? (
            <div className="py-8 text-gray-600">Loading your images…</div>
          ) : images.length === 0 ? (
            <div className="py-8 text-gray-600">You have not uploaded any images yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <ImageCard key={img._id ?? img.id} img={img} onOpen={() => setOpenImg(img)} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Lightbox open={!!openImg} img={openImg} onClose={() => setOpenImg(null)} />
    </div>
  );
}
