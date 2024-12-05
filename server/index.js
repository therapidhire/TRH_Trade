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
});
