// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import "./Header.css";

// const Header = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [contactNo, setContactNo] = useState([]);

//   const userRole = localStorage.getItem("role");
//   const location = useLocation();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/notification/getAllNotifications"
//         );

//         // console.log("get all Notifications", response.data);
//         setNotifications(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleIconClick = () => {
//     setDropdownOpen(!isDropdownOpen);
//   };

//   const dateFormate = (date)=>{
//     const newDate = new Date(date);
//     const formattedDate = newDate.toISOString().split('T')[0];
//     return formattedDate;

//   }

//   const handleNotificationClick = async (notification) => {
//     try {
//       console.log("Notification details:", notification);

//       const stockResponse = await axios.get(
//         `http://localhost:8080/api/stock-transactions/${notification.details.stockId}`
//       );
//       const stockDetails = stockResponse.data;
//       // console.log("stockDetails", stockDetails);
//       const userResponse = await axios.get(
//         `http://localhost:8080/api/users/${notification.user._id}`
//       );
//       const userDetails = userResponse.data;
//       // console.log("userDetails", userDetails);
//       setContactNo(userDetails?.ContactNo);
//       setSelectedNotification({
//         fisrtname: userDetails?.Firstname,
//         ContactNo: userDetails?.ContactNo,
//         lastname: userDetails?.Lastname,
//         useremail: userDetails?.UserEmail,
//         stockname: stockDetails?.StockId?.StockName,
//         stockType: notification?.actionType, // Assuming "type" represents buy/sell
//         stockPrice: stockDetails?.Price,
//         qty: stockDetails?.Quantity,
//         transactionDate: dateFormate(stockDetails?.createdAt), // Assuming "date" is the transaction date
//       });

//       setModalOpen(true);
//       setDropdownOpen(false); // Collapse the dropdown
//     } catch (error) {
//       console.error("Error fetching notification details:", error);
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedNotification(null);
//   };

//   const logoutuser = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   // console.log("selectedNotification", selectedNotification);

//   return (
//     <header className="dashboard-header shadow p-3 mb-5 bg-white rounded">
//       <div className="logo-container">TRH Trade Portal</div>
//       <nav className="nav-menu">
//         <ul className="nav-list">
//           <li
//             className={`nav-item ${
//               location.pathname === "/dashboard" ? "active" : ""
//             }`}
//           >
//             <Link to="/dashboard" className="nav-link">
//               Dashboard
//             </Link>
//           </li>
//           <li
//             className={`nav-item ${
//               location.pathname === "/holdings" ? "active" : ""
//             }`}
//           >
//             <Link to="/holdings" className="nav-link">
//               Holdings
//             </Link>
//           </li>
//           <li
//             className={`nav-item ${
//               location.pathname === "/positions" ? "active" : ""
//             }`}
//           >
//             <Link to="/positions" className="nav-link">
//               Positions
//             </Link>
//           </li>

//           {(userRole === "Admin" || userRole === "SuperAdmin") && (
//             <li className="nav-item notification-container">
//               <div className="notification-icon" onClick={handleIconClick}>
//                 <span className="notification-badge">
//                   {notifications.length}
//                 </span>
//                 🔔
//               </div>
//               {isDropdownOpen && (
//                 <div className="notification-dropdown">
//                   {notifications.length > 0 ? (
//                     <>
//                       {notifications.map((notif, index) => (
//                         <div
//                           key={index}
//                           className="notification-item"
//                           onClick={() => handleNotificationClick(notif)}
//                         >
//                           {notif.actionType} alert
//                         </div>
//                       ))}
//                       <div className="dropdown-footer">
//                         <button
//                           className="clear-button"
//                           onClick={() => setNotifications([])}
//                         >
//                           Clear All
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="notification-item">No notifications</div>
//                   )}
//                 </div>
//               )}
//             </li>
//           )}

//           <li
//             className={`nav-item ${
//               location.pathname === "/history" ? "active" : ""
//             }`}
//           >
//             <Link to="/history" className="nav-link">
//               History
//             </Link>
//           </li>
//           <li
//             className={`nav-item ${
//               location.pathname === "/profile" ? "active" : ""
//             }`}
//           >
//             <Link to="/profile" className="nav-link">
//               {userRole}
//             </Link>
//           </li>
//           <li
//             className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
//           >
//             <Link to="/" className="nav-link" onClick={logoutuser}>
//               Logout
//             </Link>
//           </li>
//         </ul>
//       </nav>

//       {isModalOpen && selectedNotification && (
//         <div className="notification-modal-overlay" onClick={closeModal}>
//           <div
//             className="notification-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button className="close-modal-button" onClick={closeModal}>
//               ✖
//             </button>
//             <h3 className="mb-4">Notification Details</h3>
//             <div className="innerNotificationBox">
//               <div className="notificationLine">
//                 <div className="notificationLabel">Alert Type:</div>
//                 <div className="notificationInput">
//                   {selectedNotification.stockType} Alert
//                 </div>
//               </div>

//               <div className="notificationLine">
//                 <div className="notificationLabel">Username:</div>
//                 <div className="notificationInput">
//                   {selectedNotification.fisrtname}
//                 </div>
//               </div>

//               <div className="notificationLine">
//                 <div className="notificationLabel">User Email:</div>
//                 <div className="notificationInput">
//                   {selectedNotification.useremail}
//                 </div>
//               </div>

//               <div className="notificationLine">
//                 <div className="notificationLabel">Contact No :</div>
//                 <div className="notificationInput">{contactNo}</div>
//               </div>

//               <div className="notificationLine">
//                 <div className="notificationLabel">Stock Name:</div>
//                 <div className="notificationInput">
//                   {selectedNotification.stockname}
//                 </div>
//               </div>

//               <div className="notificationLine">
//                 <div className="notificationLabel">Stock Price:</div>
//                 <div className="notificationInput">
//                   {selectedNotification.stockPrice}
//                 </div>
//               </div>

//               <div className="notificationLine">
//                 <div className="notificationLabel">Stock Quantity:</div>
//                 <div className="notificationInput">
//                   {selectedNotification.qty}
//                 </div>
//               </div>

//               <div className="notificationLine">
//                 <div className="notificationLabel">Transaction Date:</div>
//                 <div className="notificationInput">
//                 {selectedNotification.transactionDate}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [contactNo, setContactNo] = useState([]);

  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/notification/getAllNotifications"
      );
      console.log("filteredResponse", response.data.data);
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const dateFormate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split("T")[0];
    return formattedDate;
  };

  const handleNotificationClick = async (notification) => {
    try {
      console.log("Notification details ---:", notification);

      // Mark notification as read in the backend
      await axios.put(
        `http://localhost:8080/api/notification/markAsRead/${notification.id}`,
        { isRead: true }
      );

      const stockResponse = await axios.get(
        `http://localhost:8080/api/stock-transactions/${notification.details.stockId}`
      );
      const stockDetails = stockResponse.data;

      const userResponse = await axios.get(
        `http://localhost:8080/api/users/${notification.user._id}`
      );
      const userDetails = userResponse.data;

      setContactNo(userDetails?.ContactNo);
      setSelectedNotification({
        firstname: userDetails?.Firstname,
        ContactNo: userDetails?.ContactNo,
        lastname: userDetails?.Lastname,
        useremail: userDetails?.UserEmail,
        stockname: stockDetails?.StockId?.StockName,
        stockType: notification?.actionType,
        stockPrice: stockDetails?.Price,
        qty: stockDetails?.Quantity,
        transactionDate: dateFormate(stockDetails?.createdAt),
      });

      // Refresh notifications to update the count in real-time
      fetchNotifications();

      setModalOpen(true);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Error fetching notification details:", error);
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
                          <p
                            style={{
                              color: "blue",
                              fontSize: "17px",
                              fontWeight: "500",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {" "}
                            <p>{notif.actionType} Action Perfomed:</p>{" "}
                            <p
                              style={{
                                color: "orange",
                                fontSize: "12px",
                                fontWeight: "500",
                                marginLeft: "6px",
                              }}
                            >
                              see Details
                            </p>{" "}
                          </p>
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
              {/* <CgProfile /> */}
              Profile
            </Link>
          </li>
          <li
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            <Link
              to="/"
              className="nav-link"
              onClick={logoutuser}
              style={{
                fontSize: "28px",
              }}
            >
              <MdLogout />
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
            <div className="innerNotificationBox">
              <div className="notificationLine">
                <div className="notificationLabel">Alert Type:</div>
                <div className="notificationInput">
                  {selectedNotification.stockType} Alert
                </div>
              </div>

              <div className="notificationLine">
                <div className="notificationLabel">Username:</div>
                <div className="notificationInput">
                  {selectedNotification.firstname}
                </div>
              </div>

              <div className="notificationLine">
                <div className="notificationLabel">User Email:</div>
                <div className="notificationInput">
                  {selectedNotification.useremail}
                </div>
              </div>

              <div className="notificationLine">
                <div className="notificationLabel">Contact No :</div>
                <div className="notificationInput">{contactNo}</div>
              </div>

              <div className="notificationLine">
                <div className="notificationLabel">Stock Name:</div>
                <div className="notificationInput">
                  {selectedNotification.stockname}
                </div>
              </div>

              <div className="notificationLine">
                <div className="notificationLabel">Stock Price:</div>
                <div className="notificationInput">
                  {selectedNotification.stockPrice}
                </div>
              </div>

              <div className="notificationLine">
                <div className="notificationLabel">Stock Quantity:</div>
                <div className="notificationInput">
                  {selectedNotification.qty}
                </div>
              </div>

              <div className="notificationLine">
                <div className="notificationLabel">Transaction Date:</div>
                <div className="notificationInput">
                  {selectedNotification.transactionDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
