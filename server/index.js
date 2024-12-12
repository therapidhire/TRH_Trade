const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const roleRoutes = require('./src/Routes/RoleRoutes');
const userRoutes = require('./src/Routes/UserRoutes');
const stockRoutes = require('./src/Routes/StockRoutes');
const stockTransactionRoutes = require('./src/Routes/stockTransactionRoutes');
const connectDB = require('./src/Config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Or allow requests from a specific origin
app.use(cors({
  origin: 'http://localhost:3000' // Replace with your React app's origin
}));

connectDB();

// Routes
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-transactions', stockTransactionRoutes);




// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
