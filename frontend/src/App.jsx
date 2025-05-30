import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Profile.jsx";
import Login from "./Login.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
