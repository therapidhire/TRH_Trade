const express = require("express");
const {
  saveRegistrationNotification,
  saveLoginNotification,
  saveBuyNotification,
  saveSellNotification,
  getAllNotifications,
  updateNotification
} = require("../Controllers/notificationController");

const { sendMessage } = require("../Controllers/twilioNotificationController");

const notificationRouter = express.Router();

notificationRouter.post("/registerUser/:userId", saveRegistrationNotification);
notificationRouter.post("/loginUser/:userId", saveLoginNotification);
notificationRouter.post("/buyStock/:stockId", saveBuyNotification);
notificationRouter.post("/sellStock/:stockId", saveSellNotification);
notificationRouter.get("/getAllNotifications", getAllNotifications);

notificationRouter.put("/markAsRead/:notificationId", updateNotification);
// New route for sending messages
notificationRouter.post("/send-message", sendMessage);

module.exports = notificationRouter;
