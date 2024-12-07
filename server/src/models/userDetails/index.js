const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  dob: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  //   roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserRoles" }],
  roles: {
    type: String,
    enum: ["Super Admin", "Admin", "Supervisor", "User"],
    default: "User",
    ref: "UserRoles",
  },
  //   createdBy: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: true,
  //   },
  //   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update timestamps
userDetailsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = UserDetails;
