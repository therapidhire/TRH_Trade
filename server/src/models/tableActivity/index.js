const mongoose = require("mongoose");

const tableActivitySchema = new mongoose.Schema({
  getById: { type: String, required: true },
  s_Number: { type: Number },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  price: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "companyMasterTable",
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update timestamps
userSchemaMaster.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const TableActivity = mongoose.model("TableActivity", tableActivitySchema);

module.exports = TableActivity;
