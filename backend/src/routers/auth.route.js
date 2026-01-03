const express = require('express');
const  authControllers = require("../controllers/auth.controller")

const route = express.Router();

// call register  api 

route.post("/register",authControllers.registerController);




module.exports = route;