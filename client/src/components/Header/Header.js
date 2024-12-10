
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const userRole = localStorage.getItem("role");
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/notification/getAllNotifications"
        );
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setModalOpen(true);
    setDropdownOpen(false); // Collapse the dropdown
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNotification(null);
  };

  const logoutuser = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="dashboard-header shadow p-3 mb-5 bg-white rounded">
      <div className="logo-container">TRH Trade Portal</div>
      <nav className="nav-menu">
        <ul className="nav-list">
          <li className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className={`nav-item ${location.pathname === "/holdings" ? "active" : ""}`}>
            <Link to="/holdings" className="nav-link">Holdings</Link>
          </li>
          <li className={`nav-item ${location.pathname === "/positions" ? "active" : ""}`}>
            <Link to="/positions" className="nav-link">Positions</Link>
          </li>

          {userRole === "Admin" && (
            <li className="nav-item notification-container">
              <div className="notification-icon" onClick={handleIconClick}>
                <span className="notification-badge">{notifications.length}</span>
                🔔
              </div>
              {isDropdownOpen && (
                <div className="notification-dropdown">
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notif, index) => (
                        <div
                          key={index}
                          className="notification-item"
                          onClick={() => handleNotificationClick(notif)}
                        >
                          {notif.actionType} alert
                        </div>
                      ))}
                      <div className="dropdown-footer">
                        <button className="clear-button" onClick={() => setNotifications([])}>
                          Clear All
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="notification-item">No notifications</div>
                  )}
                </div>
              )}
            </li>
          )}

          <li className={`nav-item ${location.pathname === "/history" ? "active" : ""}`}>
            <Link to="/history" className="nav-link">History</Link>
          </li>
          <li className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
            <Link to="/profile" className="nav-link">{userRole}</Link>
          </li>
          <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
            <Link to="/" className="nav-link" onClick={logoutuser}>Logout</Link>
          </li>
        </ul>
      </nav>

      {isModalOpen && selectedNotification && (
        <div className="notification-modal-overlay" onClick={closeModal}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-button" onClick={closeModal}>✖</button>
            <h3 className="mb-4">Notification Details</h3>
            <p><strong>Notification about:</strong> {selectedNotification.actionType}</p>
            <p><strong>Message:</strong> {selectedNotification?.user.email}</p>
            <p><strong>Details:</strong> {selectedNotification?._id || "No additional details available."}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
