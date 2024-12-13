const express = require("express");

const { saveRegistrationNotification,
    saveLoginNotification,
    saveBuyNotification,
    saveSellNotification,
    getAllNotifications, } = require("../Controllers/notificationController");

const notificationRouter = express.Router();

notificationRouter.post("/registerUser/:userId", saveRegistrationNotification);
notificationRouter.post("/loginUser/:userId", saveLoginNotification);
notificationRouter.post("/buyStock/:stockId", saveBuyNotification);
notificationRouter.post("/sellStock/:stockId", saveSellNotification);
notificationRouter.get("/getAllNotifications", getAllNotifications);

module.exports = notificationRouter;
