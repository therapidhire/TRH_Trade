const express = require('express');
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getAllTransactionByUserId,
  getTransactionForNotificationById,
} = require('../Controllers/stockTransactionController');

const router = express.Router();

// CRUD routes
router.post('/', createTransaction); // Create a new transaction
router.get('/', getAllTransactions); // Get all transactions
router.get('/:stockId', getTransactionById); // Get a transaction by transactionID
router.get('/notification/:stockId', getTransactionForNotificationById); // Get a transaction by transactionID

router.get('/transaction/:userId', getAllTransactionByUserId); // Get all transaction of a user by userId
router.put('/:id', updateTransaction); // Update transaction
router.delete('/:id', deleteTransaction); // Delete transaction

module.exports = router;
