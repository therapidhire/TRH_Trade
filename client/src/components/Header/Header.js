import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Add the styles for the header in this file


const Header = () => {
  return (
    <header className="dashboard-header">
      <div className="logo-container">
        {/* <img
          src="https://via.placeholder.com/150x50.png?text=Logo" // Replace with your logo path
          alt="Logo"
          className="logo"
        /> */}
        TRH Trade Portal
      </div>
      <nav className="nav-menu">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/holdings" className="nav-link">
              Holdings
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/logout" className="nav-link">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
