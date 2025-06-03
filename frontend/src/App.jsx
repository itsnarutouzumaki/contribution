import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Profile.jsx";
import Login from "./Login.jsx";
import { Toaster } from "react-hot-toast";

/**
 * Main application component that sets up the routing structure for the app.
 *
 * - Renders the `Login` component at the root path (`/`).
 * - Renders the `Profile` component at the `/dashboard` path.
 * - Includes a global `Toaster` component for displaying notifications.
 *
 * Uses React Router for client-side navigation.
 *
 * @component
 * @returns {JSX.Element} The root component containing application routes and global UI elements.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Profile />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
