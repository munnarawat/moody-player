const express = require('express');
const  authControllers = require("../controllers/auth.controller")
const  {authMiddleware} = require("../middleware/auth.middleware")
const route = express.Router();

// create  register  api 
route.post("/register",authControllers.registerController);

// create login api
route.post("/login", authMiddleware, authControllers.loginController)



module.exports = route;