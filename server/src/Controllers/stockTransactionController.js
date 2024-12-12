const StockTransaction = require('../Models/StockTransaction');
const User = require('../Models/UserModel');
const mongoose = require('mongoose');

// Create a new stock transaction
// const createTransaction = async (req, res) => {
//   try {
//     console.log("req body in buy sell backend", req.body);
//     const transaction = new StockTransaction(req.body);
//     await transaction.save();
//     res.status(201).json({ message: 'Transaction created successfully', transaction });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// const createTransaction = async (req, res) => {
//   try {
//     const { UserId, StockId, Quantity, Price, TransactionType } = req.body; // Extract necessary fields from the request
//     console.log("createTransaction:-- ", req.body);
//     if (TransactionType === "buy") {
//       // Handle Buy Transaction
//       let existingTransaction = await StockTransaction.findOne({
//         UserId,
//         StockId,
//         TransactionType: "buy",
//       });

//       if (existingTransaction) {
//         // Calculate new average Price
//         const totalQuantity = existingTransaction.Quantity + Quantity;
//         const totalValue =
//           existingTransaction.Quantity * existingTransaction.Price +
//           Quantity * Price;
//         const averagePrice = totalValue / totalQuantity;

//         // Update existing transaction
//         existingTransaction.Quantity = totalQuantity;
//         existingTransaction.Price = averagePrice; // Update Price to the new average Price
//         await existingTransaction.save();

//         return res.status(200).json({
//           message: "Buy transaction updated successfully",
//           transaction: existingTransaction,
//         });
//       } else {
//         // Create new transaction
//         const transaction = new StockTransaction({
//           UserId,
//           StockId,
//           Quantity,
//           Price,
//           TransactionType: "buy",
//         });
//         await transaction.save();
//         return res.status(201).json({
//           message: "Buy transaction created successfully",
//           transaction,
//         });
//       }
//     } else if (TransactionType === "sell") {
//       // Handle Sell Transaction
//       let buyTransaction = await StockTransaction.findOne({
//         UserId,
//         StockId,
//         TransactionType: "buy",
//       });

//       if (!buyTransaction || buyTransaction.Quantity < Quantity) {
//         return res.status(400).json({
//           message: "Insufficient stock to sell or no buy transaction found",
//         });
//       }

//       // Adjust buy transaction Quantity
//       buyTransaction.Quantity -= Quantity;
//       await buyTransaction.save();

//       // Create sell transaction
//       const sellTransaction = new StockTransaction({
//         UserId,
//         StockId,
//         Quantity,
//         Price,
//         TransactionType: "sell",
//       });
//       await sellTransaction.save();

//       return res.status(201).json({
//         message: "Sell transaction created successfully",
//         sellTransaction,
//         updatedBuyTransaction: buyTransaction,
//       });
//     } else {
//       return res.status(400).json({ message: "Invalid transaction TransactionType" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



const createTransaction = async (req, res) => {
  try {
    const { UserId, StockId, Quantity, Price, TransactionType } = req.body;
    console.log("createTransaction:-- ", req.body);

    if (TransactionType === "buy") {
      // Handle Buy Transaction
      let existingTransaction = await StockTransaction.findOne({
        UserId,
        StockId,
        TransactionType: "buy",
      });

      if (existingTransaction) {
        // Calculate new average Price
        const totalQuantity = existingTransaction.Quantity + Quantity;
        const totalValue =
          existingTransaction.Quantity * existingTransaction.Price +
          Quantity * Price;
        const averagePrice = totalValue / totalQuantity;

        // Update existing transaction
        existingTransaction.Quantity = totalQuantity;
        existingTransaction.Price = averagePrice; // Update Price to the new average Price
        await existingTransaction.save();

        return res.status(200).json({
          message: "Buy transaction updated successfully",
          transaction: existingTransaction,
        });
      } else {
        // Create new transaction
        const transaction = new StockTransaction({
          UserId,
          StockId,
          Quantity,
          Price,
          TransactionType: "buy",
        });
        await transaction.save();
        return res.status(201).json({
          message: "Buy transaction created successfully",
          transaction,
        });
      }
    } else if (TransactionType === "sell") {
      // Handle Sell Transaction
      let buyTransaction = await StockTransaction.findOne({
        UserId,
        StockId,
        TransactionType: "buy",
      });

      if (!buyTransaction || buyTransaction.Quantity < Quantity) {
        return res.status(400).json({
          message: "Insufficient stock to sell or no buy transaction found",
        });
      }

      // Adjust buy transaction Quantity
      const remainingQuantity = buyTransaction.Quantity - Quantity;
      const totalValue = remainingQuantity * buyTransaction.Price; // Calculate remaining total value

      // Recalculate the average price if quantity is reduced
      if (remainingQuantity > 0) {
        const averagePrice = totalValue / remainingQuantity;
        buyTransaction.Quantity = remainingQuantity;
        buyTransaction.Price = averagePrice;
      } else {
        // If all stock is sold, remove the buy transaction
        await buyTransaction.remove();
      }

      await buyTransaction.save();

      // Create a new sell transaction
      const sellTransaction = new StockTransaction({
        UserId,
        StockId,
        Quantity,
        Price,
        TransactionType: "sell",
      });
      await sellTransaction.save();

      return res.status(201).json({
        message: "Sell transaction created successfully",
        sellTransaction,
        updatedBuyTransaction: buyTransaction || "Buy transaction removed after sell",
      });
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stock transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await StockTransaction.find()
      .populate('StockId', 'Symbol StockName') // Populate stock details
      .populate('UserId', 'Firstname Lastname'); // Populate user details
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific stock transaction by ID
// const getTransactionById = async (req, res) => {
//   try {
//     const transaction = await StockTransaction.findById(req.params.id)
//       .populate('StockId', 'Symbol StockName')
//       .populate('UserId', 'Firstname Lastname');
//     if (!transaction) {
//       return res.status(404).json({ error: 'Transaction not found' });
//     }
//     res.status(200).json(transaction);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



// const getTransactionById = async (req, res) => {
//   try {
//     // Extract StockId from request params or query
//     const { stockId } = req.params;
//     console.log("stockId:-- ", stockId);

//     if (!stockId) {
//       return res.status(400).json({ message: 'StockId is required' });
//     }

//     // Find the transaction by StockId
//     const transaction = await StockTransaction.findOne({ 'StockId._id':stockId });
// // const transaction = await StockTransaction.findOne({ 'StockId._id': mongoose.Types.ObjectId(stockId) });
//     console.log("Transaction:- ",transaction);

//     if (!transaction) {
//       return res.status(404).json({ message: 'Transaction not found for the given StockId' });
//     }

//     // Respond with the transaction details
//     res.status(200).json(transaction);
//   } catch (error) {
//     console.error('Error fetching transaction:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };


const getTransactionById = async (req, res) => {
  try {
    // Extract StockId from request params
    const { stockId } = req.params;

    console.log("StockId:-- ", stockId);

    if (!stockId) {
      return res.status(400).json({ message: 'StockId is required' });
    }

    // Validate the StockId format
    if (!mongoose.Types.ObjectId.isValid(stockId)) {
      return res.status(400).json({ message: 'Invalid StockId format' });
    }

    // Find the transaction by StockId
    const transaction = await StockTransaction.findOne({ StockId: stockId })
      .populate('StockId') // Optional: populate related Stock details
      .populate('UserId') // Optional: populate related User details
      .populate('CreatedBy UpdatedBy'); // Optional: populate CreatedBy/UpdatedBy

    console.log("Transaction:- ", transaction);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found for the given StockId' });
    }

    // Respond with the transaction details
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




// const getAllTransactionByUserId = async (req, res)=>{
//   try{
//     const userId = req.params;
//     const AllTransactionOfuser = await StockTransaction.find({'UserId._id': userId});
//     console.log("AllTransactionOfuser:- ",AllTransactionOfuser);
//     res.status(200).json(AllTransactionOfuser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

const getAllTransactionByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from the route parameters
    console.log("userId:--", userId);

    // Query the database using the correct field name "UserId"
    const transactions = await StockTransaction.find({ UserId: userId });
    console.log("transactions:--", transactions);

    // Return the array of transactions
    res.status(200).json(transactions);
  } catch (error) {
    // Handle errors
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};




// Update a stock transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await StockTransaction.findByIdAndUpdate(
      req.params.id,
      { ...req.body, UpdatedAt: new Date() },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a stock transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await StockTransaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getAllTransactionByUserId,
};
