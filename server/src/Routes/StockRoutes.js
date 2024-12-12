const express = require('express');
const {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
  uploadCsv 
} = require('../Controllers/stockController');

const upload = require('../Middelware/Upload');

const router = express.Router();

router.post('/upload-csv', upload.single('file'), uploadCsv);
router.post('/', createStock);
router.get('/', getAllStocks);
router.get('/:id', getStockById);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);


module.exports = router;
