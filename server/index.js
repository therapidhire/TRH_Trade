<<<<<<< HEAD
const express = require("express");
const connectDB = require("./src/config/dbConnect");
const app = express();
var cors = require("cors");

// Connect Database
connectDB();

// const { WhatsAppConnectRoute } = require("./web/router");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World! vinit");
});

// app.use("/contact-us", WhatsAppConnectRoute);

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
=======
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const roleRoutes = require('./src/Routes/RoleRoutes');
const userRoutes = require('./src/Routes/UserRoutes');
const stockRoutes = require('./src/Routes/StockRoutes');
const notificationRouter = require('./src/Routes/notificationRouter')
const stockTransactionRoutes = require('./src/Routes/stockTransactionRoutes');
const connectDB = require('./src/Config/db');
const cors = require('cors');
const authRouter = require('./src/Routes/AuthRoutes');

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
app.use('/api/notification', notificationRouter);
app.use('/api/stock-transactions', stockTransactionRoutes);
app.use('/api/auth', authRouter);




// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
>>>>>>> 40d2675f9c59758553db2378c324732a4a353da5
});
