const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcryptJs = require("bcryptjs");

const registerController = async (req,res)=>{

    const {fullName:{firstName,lastName},email, password} = req.body;

    const userExits = await userModel.findOne({
        email
    });
    
}


module.exports ={
    registerController 
}