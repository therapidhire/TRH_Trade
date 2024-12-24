const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  Symbol: { type: String, required: true, unique: true },
  StockName: { type: String, required: true },
  ISINNumber: { type: String, required: true, unique: true },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
