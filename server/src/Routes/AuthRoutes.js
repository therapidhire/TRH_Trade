const express = require("express");
const login = require("../Controllers/AuthController");


const authRouter = express.Router();

authRouter.post("/user/login", login);


module.exports = authRouter;
