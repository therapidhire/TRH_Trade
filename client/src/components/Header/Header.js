import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // Function to fetch all notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/notification/getAllNotifications"
      );

      console.log("get all Notifications", response.data.data);
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, []);

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleNotificationClick = async (notification) => {
    try {
      console.log("Clicked Notification:", notification);

      const stock_id = notification?.details?.stockId;

      // Fetch stock details
      const stockDetailsResponse = await axios.get(
        `http://localhost:8080/api/stock-transactions/${stock_id}`
      );
      console.log("Stock Details:", stockDetailsResponse.data);

      // Mark the notification as read
      await axios.put(
        `http://localhost:8080/api/notification/markAsRead/${notification.id}`,
        { isRead: true }
      );

      // Prepare notification details
      const NotificationDetails = {
        actionType: stockDetailsResponse.data.TransactionType || "N/A",
        name: stockDetailsResponse.data.UserId?.Firstname || "N/A",
        email: stockDetailsResponse.data.UserId?.UserEmail || "N/A",
        contact: stockDetailsResponse.data.UserId?.ContactNo || "N/A",
        accountType: stockDetailsResponse.data.AccountType || "N/A",
        stockName: stockDetailsResponse.data.StockId?.StockName || "N/A",
        price: stockDetailsResponse.data.Price || "N/A",
        qty: stockDetailsResponse.data.Quantity || "N/A",
        reason: stockDetailsResponse.data.Reason || "N/A",
      };

      console.log("Parsed Notification Details:", NotificationDetails);

      // Update the selected notification state
      setSelectedNotification(NotificationDetails);

      // Open the modal and close the dropdown
      setModalOpen(true);
      setDropdownOpen(false);

      // Re-fetch all notifications to update the list
      await fetchNotifications();
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
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
          <li
            className={`nav-item ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === "/holdings" ? "active" : ""
            }`}
          >
            <Link to="/holdings" className="nav-link">
              Holdings
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === "/positions" ? "active" : ""
            }`}
          >
            <Link to="/positions" className="nav-link">
              Positions
            </Link>
          </li>

          {(userRole === "Admin" || userRole === "SuperAdmin") && (
            <li className="nav-item notification-container">
              <div className="notification-icon" onClick={handleIconClick}>
                <span className="notification-badge">
                  {notifications.length}
                </span>
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
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <p>{notif.actionType} Action is Performed:</p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "orange",
                                fontWeight: "200",
                                marginLeft: "10px",
                              }}
                            >
                              See Details
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="dropdown-footer">
                        <button
                          className="clear-button"
                          onClick={() => setNotifications([])}
                        >
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

          <li
            className={`nav-item ${
              location.pathname === "/history" ? "active" : ""
            }`}
          >
            <Link to="/history" className="nav-link">
              History
            </Link>
          </li>
          <li
            className={`nav-item ${
              location.pathname === "/profile" ? "active" : ""
            }`}
          >
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            <Link to="/" className="nav-link" style={{
              color: "blue",
              fontWeight:"bold",
              fontSize:"25px"
            }} onClick={logoutuser}>
              <IoIosLogOut />
            </Link>
          </li>
        </ul>
      </nav>

      {isModalOpen && selectedNotification && (
        <div className="notification-modal-overlay" onClick={closeModal}>
          <div
            className="notification-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-button" onClick={closeModal}>
              ✖
            </button>
            <h3 className="mb-4">Notification Details</h3>

            <div className="NotificationDetailDiv">
              <div className="notificationHeading">
                <h1 className="heading">Action:</h1>
                <p className="para">{selectedNotification.actionType}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">User name:</h1>
                <p className="para">{selectedNotification.name}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">Email: </h1>
                <p className="para">{selectedNotification.email}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">Contact No: </h1>
                <p className="para">{selectedNotification.contact}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">Account Type:</h1>
                <p className="para">{selectedNotification.accountType}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">Stock: </h1>
                <p className="para">{selectedNotification.stockName}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">Price: </h1>
                <p className="para">{selectedNotification.price}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">Quantity:</h1>
                <p className="para">{selectedNotification.qty}</p>
              </div>
              <div className="notificationHeading">
                <h1 className="heading">Reason: </h1>
                <p className="para">{selectedNotification.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
