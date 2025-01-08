import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationDropdown = ({
  setModalOpen,
  setDropdownOpen,
  setSelectedNotification,
  notifications,
  setNotifications,
}) => {
  const [mappedNotification, setMappedNotification] = useState({});

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/notification/getAllNotifications"
      );

      const allNotification = response.data.data;
      const mappedNotificationtmp = {};

      if (allNotification && allNotification.length > 0) {
        await Promise.all(
          allNotification.map(async (notification) => {
            if (notification?.details?.stockId) {
              const stockResponse = await axios.get(
                `http://localhost:8080/api/stock-transactions/notification/${notification.details.stockId}`
              );
              if (stockResponse.data) {
                mappedNotificationtmp[notification.id] = stockResponse.data;
              }
            }
          })
        );
      }

      setMappedNotification(mappedNotificationtmp);
      setNotifications(allNotification || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  // Fetch on mount and when dropdown opens
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification?.details?.stockId) return;

      const stockDetailsResponse = await axios.get(
        `http://localhost:8080/api/stock-transactions/notification/${notification.details.stockId}`
      );

      await axios.put(
        `http://localhost:8080/api/notification/markAsRead/${notification.id}`,
        { isRead: true }
      );

      const NotificationDetails = {
        actionType: stockDetailsResponse.data?.TransactionType || "N/A",
        firstname: stockDetailsResponse.data?.UserId?.Firstname || "N/A",
        lastname: stockDetailsResponse.data?.UserId?.Lastname || "N/A",
        email: stockDetailsResponse.data?.UserId?.UserEmail || "N/A",
        contact: stockDetailsResponse.data?.UserId?.ContactNo || "N/A",
        accountType: stockDetailsResponse.data?.AccountType || "N/A",
        stockName: stockDetailsResponse.data?.StockId?.StockName || "N/A",
        price: stockDetailsResponse.data?.Price || "N/A",
        qty: stockDetailsResponse.data?.Quantity || "N/A",
        reason: stockDetailsResponse.data?.Reason || "N/A",
      };

      setSelectedNotification(NotificationDetails);
      setModalOpen(true);
      setDropdownOpen(false);
      await fetchNotifications();
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  return (
    <div className="notification-dropdown">
      {notifications?.length > 0 ? (
        <>
          {notifications.map((notif, index) => (
            <div
              key={index}
              className="notification-item"
              onClick={() => handleNotificationClick(notif)}
            >
              <div style={{ display: "flex" }}>
                {mappedNotification[notif.id] ? (
                  <p style={{ fontWeight: "400" }}>
                    {mappedNotification[notif.id]?.TransactionType}:{" "}
                    {mappedNotification[notif.id]?.Quantity} stock of{" "}
                    {mappedNotification[notif.id]?.StockId?.StockName} are{" "}
                    {mappedNotification[notif.id]?.TransactionType} at the price{" "}
                    {mappedNotification[notif.id]?.Price}
                  </p>
                ) : (
                  <p>Loading notification details...</p>
                )}
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
  );
};

export default NotificationDropdown;
