const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema(
  {
    StockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    TransactionType: { type: String, enum: ['buy', 'sell'], required: true },
    Price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
    AccountType: {type: String, required: true},
    Reason: {type: String, required: true},
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    UpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
