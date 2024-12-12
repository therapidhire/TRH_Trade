const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel", // Reference to the user table
    required: true,
  },
  actionType: {
    type: String,
    enum: ["REGISTER", "LOGIN", "BUY", "SELL"], // Restrict to specific action types
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Dynamic field for storing action-specific details
  },
  isRead:{
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
