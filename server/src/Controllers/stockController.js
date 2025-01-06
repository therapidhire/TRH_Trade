const Stock = require('../Models/StockModel');
const fs = require('fs');
const csv = require('csv-parser');

// Create Stock
const createStock = async (req, res) => {
  try {
    const stock = new Stock(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Stocks
const getAllStocks = async (req, res) => {
  try {
    console.log("called");
    const stocks = await Stock.find();
    // console.log(stocks);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Stock by ID
const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Stock
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Stock
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadCsv = async (req, res) => {
    try {
      const filePath = req.file.path; // Path of the uploaded file
      const stocks = []; // Array to hold parsed stocks
      console.log(filePath)
      // Read and parse the CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          stocks.push({
            Symbol: row.Symbol,
            StockName: row.StockName,
            ISINNumber: row.ISINNumber,
          });
        })
        .on('end', async () => {
          try {
            // Insert parsed data into the database
            await Stock.insertMany(stocks);
            res.status(201).json({ message: 'Stocks uploaded successfully!', stocks });
          } catch (dbError) {
            res.status(500).json({ error: 'Error inserting data into the database', details: dbError.message });
          }
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
  uploadCsv
};
