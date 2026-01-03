const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req,res,next) =>{
    const {token} = res.cookie;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized token 😖"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id)
        if(!user){
            return res.status(401).json({
                message:"user not found"
            })
        };

        req.user ={
            id: user._id,
            userName: user.userName,
            email:user.email,
            fullName: user.fullName
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message:"Unauthorized",
        })
    }
}

module.exports = {
    authMiddleware
}