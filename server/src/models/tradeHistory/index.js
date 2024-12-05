const mongoose = require("mongoose");

const tradeHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  shares: [
    {
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      buyDate: { type: Date, required: true },
      endDate: { type: Date },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

tradeHistorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const TradeHistory = mongoose.model("TradeHistory", tradeHistorySchema);

module.exports = TradeHistory;
