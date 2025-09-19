import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";

import Upload from "./pages/Upload";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
      <App/>
    
  </React.StrictMode>
);
