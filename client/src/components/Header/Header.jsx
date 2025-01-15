import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import "./Header.css";
import { useAuth } from "../../context/AuthProvider";
import { navItems } from "../../data/jsonData";
import NotificationDropdown from "../../pages/Notification/NotificationDropdown";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const userRole = localStorage.getItem("role");
  const location = useLocation();
  const auth = useAuth();

  // Fetch notifications immediately on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/notification/getAllNotifications"
        );
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up polling interval
    // const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    // // Cleanup on unmount
    // return () => clearInterval(intervalId);
  }, []);

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <header className="dashboard-header shadow p-3 mb-5 bg-white rounded">
      <div className="logo-container">TRH Trade Portal</div>
      <nav className="nav-menu">
        <ul className="nav-list">
          {navItems.map((item) => {
            if (item.name === "Notifications") {
              return (
                (userRole === "Admin" || userRole === "SuperAdmin") && (
                  <li key={item.id} className="nav-item notification-container">
                    <div
                      className="notification-icon"
                      onClick={handleIconClick}
                    >
                      <span className="notification-badge">
                        {notifications.length}
                      </span>
                      🔔
                    </div>
                    {isDropdownOpen && (
                      <NotificationDropdown
                        setModalOpen={setModalOpen}
                        setDropdownOpen={setDropdownOpen}
                        setSelectedNotification={setSelectedNotification}
                        setNotifications={setNotifications}
                        notifications={notifications}
                      />
                    )}
                  </li>
                )
              );
            }

            if (item.name === "Logout") {
              return (
                <li
                  key={item.id}                  
                  className={`nav-item fw-bold fs-3  ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <Link
                    to={item.path}
                    className="nav-link logout-link"
                    onClick={() => auth.logOut()}
                  >
                    <IoIosLogOut className="text-primary" />
                  </Link>
                </li>
              );
            }

            return (
              <li
                key={item.id}
                className={`nav-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <Link to={item.path} className="nav-link">
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {isModalOpen && selectedNotification && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg w-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Notification Details</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="container w-75">
                  {Object.entries(selectedNotification).map(([key, value]) => (
                    <div
                      key={key}
                      className="row mb-3 align-items-center justify-content-center"
                    >
                      {/* Key with first letter capitalized */}
                      <div className="col-4 d-flex fw-bold text-end">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      {/* Centered ":" */}
                      <div className="col-1 text-center">:</div>
                      {/* Value */}
                      <div className="col-6">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>
            Close
          </button>
        </div> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
