import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import BuySellModal from "./pages/BuySellModal/BuySellModal";
import Holding from "./pages/Holding/Holding"; // Import the Holding component
import Position from "./pages/Position/Positions";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trade/:action/:stock" element={<BuySellModal />} />
        <Route path="/holdings" element={<Holding />} /> {/* Added the route for Holding */}
        <Route path="/positions" element={<Position/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;
