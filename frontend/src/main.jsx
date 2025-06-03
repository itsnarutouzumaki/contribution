import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./axiosConfig";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <App />
  </>
);
