import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const BATCH_SIZE = 5; // Number of notifications to load per scroll

  // Simulated notifications data
  useEffect(() => {
    const mockNotifications = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      message: `Notification ${i + 1}`,
    }));
    setNotifications(mockNotifications);
    setVisibleNotifications(mockNotifications.slice(0, BATCH_SIZE));
    setCurrentIndex(BATCH_SIZE);
  }, []);

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      loadMoreNotifications();
    }
  };

  const loadMoreNotifications = () => {
    const nextBatch = notifications.slice(
      currentIndex,
      currentIndex + BATCH_SIZE
    );
    setVisibleNotifications((prev) => [...prev, ...nextBatch]);
    setCurrentIndex((prev) => prev + BATCH_SIZE);
  };

  return (
    <header className="dashboard-header shadow p-3 mb-5 bg-white rounded">
      <div className="logo-container">
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
            <Link to="/positions" className="nav-link">
              Positions
            </Link>
          </li>
          <li className="nav-item notification-container">
            <div className="notification-icon" onClick={handleIconClick}>
              <span className="notification-badge">
                {notifications.length}
              </span>
              🔔
            </div>
            {isDropdownOpen && (
              <div
                className="notification-dropdown"
                onScroll={handleScroll}
              >
                {visibleNotifications.map((notif) => (
                  <div key={notif.id} className="notification-item">
                    {notif.message}
                  </div>
                ))}
                {visibleNotifications.length < notifications.length && (
                  <div className="loading-message">Loading more...</div>
                )}
              </div>
            )}
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
