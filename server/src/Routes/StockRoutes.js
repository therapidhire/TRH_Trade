const express = require('express');
const {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
  uploadCsv,
  getStocksByIds
} = require('../Controllers/stockController');

const upload = require('../Middelware/Upload');

const router = express.Router();

router.post('/upload-csv', upload.single('file'), uploadCsv);
router.post('/', createStock);
router.get('/', getAllStocks);
router.get('/:id', getStockById);
router.post('/getStockByIds', getStocksByIds);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);


module.exports = router;
