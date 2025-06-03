/**
 * Entry point for the React application.
 *
 * - Imports React's StrictMode for highlighting potential problems in the application.
 * - Uses React 18's `createRoot` API to enable concurrent features.
 * - Imports the main `App` component, global Axios configuration, and global CSS styles.
 * - Renders the `App` component inside the DOM element with the id "root".
 *
 * @module main
 */
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
