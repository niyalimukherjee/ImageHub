// SearchResults.jsx
import { useLocation } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import { useEffect, useState } from "react";
import { searchImages } from "../utils/api.js"; // <- import the helper

export default function SearchResults() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const query = queryParams.get("q")?.trim() ?? "";

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setImages([]);
      return;
    }

    setLoading(true);
    setError(null);

    searchImages(query, "true")
      .then((data) => {
        setImages(data);
      })
      .catch((err) => {
        setError(err.message || "Error fetching search results");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {!query && <p>Please enter a search query.</p>}

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && images.length === 0 && query && (
        <p>No results found for "{query}".</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img) => (
          // prefer Mongo _id if present
          <ImageCard key={img._id ?? img.id ?? img.url ?? img.src} img={img} />
        ))}
      </div>
    </div>
  );
}
