const mongoose = require("mongoose");
const User = require("../Models/UserModel")
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User, // Reference to the user table
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
  isRead:{
    type:Boolean,
    default:false,
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
