// src/pages/Upload.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadImage } from "../lib/apiClient";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categories: "",
    privacy: "public",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // If you require auth for upload, check token presence
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Revoke preview URL when component unmounts or when preview changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file." });
      return;
    }
    // revoke previous preview to avoid memory leak
    if (preview) URL.revokeObjectURL(preview);
    const newPreview = URL.createObjectURL(f);
    setFile(f);
    setPreview(newPreview);
    setMessage(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage({ type: "error", text: "You must be logged in to upload. Please login." });
      return;
    }

    if (!file) {
      setMessage({ type: "error", text: "Please choose an image to upload." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("categories", form.categories);
      fd.append("isPublic", form.privacy === "public" ? "true" : "false");

      const result = await uploadImage(fd);
      console.log("upload result:", result);

      setMessage({ type: "success", text: "Uploaded successfully!" });

      // reset and revoke preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(null);
      setPreview(null);
      setForm({ title: "", description: "", categories: "", privacy: "public" });

      // navigate to gallery (or wherever makes sense)
      navigate("/gallery");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>

        {!token && (
          <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800">
            You are not logged in. <Link to="/login" className="underline">Log in</Link> to upload images.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>

          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Preview</p>
              <img src={preview} alt="preview" className="w-full max-h-96 object-contain rounded border" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="Give your image a title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categories (comma separated)</label>
            <input
              name="categories"
              value={form.categories}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="e.g., travel, nature, portrait"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Privacy</label>
            <select
              name="privacy"
              value={form.privacy}
              onChange={handleChange}
              className="mt-1 px-3 py-2 border rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !token}
              className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 transition"}`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (preview) URL.revokeObjectURL(preview);
                setFile(null);
                setPreview(null);
                setMessage(null);
                setForm({ title: "", description: "", categories: "", privacy: "public" });
              }}
              className="px-3 py-2 rounded border"
            >
              Reset
            </button>
          </div>

          {message && (
            <div className={`mt-2 p-2 rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
