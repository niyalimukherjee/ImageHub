// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout as apiLogout } from "../lib/apiClient"; // adjust path if needed

export default function Header() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    getCurrentUser()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
      })
      .catch((err) => {
        console.warn("Failed to get current user:", err);
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        if (mounted) setLoadingUser(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    try {
      apiLogout?.();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("token");
    setUser(null);
    try {
      navigate("/login");
    } catch {
      window.location.href = "/login";
    }
  };

  const goToUpload = () => {
    try {
      navigate("/upload");
    } catch {
      window.location.href = "/upload";
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Image Hub</h1>
            </Link>

            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-2 py-1 gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search images, categories..."
                className="bg-transparent text-sm placeholder-gray-500 focus:outline-none px-2"
                aria-label="Search images"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Upload button (visible on all sizes) */}
            <button
              onClick={goToUpload}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:shadow"
              type="button"
              aria-label="Upload"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Upload</span>
            </button>

            {/* Auth buttons */}
            {loadingUser ? (
              <div className="px-3 py-2 rounded-lg text-sm text-gray-600">Checking...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Avatar + username link to profile */}
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 no-underline hover:opacity-90"
                  title="View profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                    {user.username?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="text-sm text-gray-700">{user.username}</div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded-lg border hover:bg-red-100"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700">
                  Sign in
                </Link>
                <Link to="/register" className="px-3 py-2 border rounded-lg hover:shadow hidden md:inline-flex">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
