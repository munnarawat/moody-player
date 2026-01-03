const express = require('express');
const  authControllers = require("../controllers/auth.controller")

const route = express.Router();

// create  register  api 
route.post("/register",authControllers.registerController);

// create login api
route.post("/login", authControllers.loginController)



module.exports = route;