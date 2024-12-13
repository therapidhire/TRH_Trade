const Notification = require("../Models/NotificationModel");

const saveRegistrationNotification = async () => {
  try {
    const userId = req.params;
    const notification = new Notification({
      userId: userId,
      actionType: "REGISTER",
      details: {
        name: user.name,
        email: user.email,
        phone: user.phone || "N/A",
        address: user.address || "N/A",
      },
    });
    await notification.save();
    console.log("Registration notification saved.");
  } catch (error) {
    console.error("Error saving registration notification:", error.message);
  }
};

// Function to save a login notification
const saveLoginNotification = async () => {
  try {
    const userId = req.params;
    const notification = new Notification({
      userId,
      actionType: "LOGIN",
      details: {
        loginTime: new Date(),
        ipAddress: ipAddress || "Unknown IP",
      },
    });
    await notification.save();
    console.log("Login notification saved.");
  } catch (error) {
    console.error("Error saving login notification:", error.message);
  }
};

// Function to save a buy stock notification
// const saveBuyNotification = async () => {
//   try {
//     const {isin_Num, userId} = req.params;
//     const notification = new Notification({
//       userId,
//       actionType: "BUY",
//       details: {
//         isin_Num,
//         transactionTime: new Date(),
//       },
//     });
//     await notification.save();
//     console.log("Buy stock notification saved.");
//   } catch (error) {
//     console.error("Error saving buy stock notification:", error.message);
//   }
// };

// // Function to save a sell stock notification
// const saveSellNotification = async (userId, isin_Num) => {
//   try {
//     const {isin_Num, userId} = req.params;
//     const notification = new Notification({
//       userId,
//       actionType: "SELL",
//       details: {
//         isin_Num,
//         transactionTime: new Date(),
//       },
//     });
//     await notification.save();
//     console.log("Sell stock notification saved.");
//   } catch (error) {
//     console.error("Error saving sell stock notification:", error.message);
//   }
// };

const saveBuyNotification = async (userId, stockId) => {
    try {
      const notification = new Notification({
        userId,
        actionType: "BUY",
        details: {
          stockId,
          transactionTime: new Date(),
        },
      });
      await notification.save();
      console.log("Buy stock notification saved.");
    } catch (error) {
      console.error("Error saving buy stock notification:", error.message);
    }
  };
  
  const saveSellNotification = async (userId, stockId) => {
    try {
      const notification = new Notification({
        userId,
        actionType: "SELL",
        details: {
          stockId,
          transactionTime: new Date(),
        },
      });
      await notification.save();
      console.log("Sell stock notification saved.");
    } catch (error) {
      console.error("Error saving sell stock notification:", error.message);
    }
  };


// Function to fetch all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("userId", "name email") // Populate user details (name and email)
      .sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({
      message: "Notifications fetched successfully.",
      data: notifications.map((notif) => ({
        actionType: notif.actionType,
        details: notif.details || "N/A",
        createdAt: notif.createdAt,
        user: notif.userId || "N/A",
      })),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  saveRegistrationNotification,
  saveLoginNotification,
  saveBuyNotification,
  saveSellNotification,
  getAllNotifications,
};
