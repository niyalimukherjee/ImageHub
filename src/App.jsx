// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import SharedInline from "./pages/SharedInline";
import SharedById from "./pages/SharedById";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/gallery" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
         <Route path="/profile" element={<Profile/>} />
         <Route path="/search" element={<SearchResults />} />
         <Route path="/share/inline/:payload" element={<SharedInline />} />
<Route path="/share/id/:id" element={<SharedById />} />
      </Routes>
    </Router>
  );
}

export default App;
