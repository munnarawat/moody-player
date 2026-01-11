const express = require('express');
const  authControllers = require("../controllers/auth.controller")
const  {authMiddleware} = require("../middleware/auth.middleware")
const route = express.Router();

// create  register  api 
route.post("/register",authControllers.registerController);

// create login api
route.post("/login",  authControllers.loginController)

// get current user api
route.get("/", authMiddleware , authControllers.getCurrentUser);

// logout user api
route.post("/logout", authControllers.logOutUserController);


module.exports = route;