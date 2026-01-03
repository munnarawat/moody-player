const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcryptJs = require("bcryptjs");

const registerController = async (req, res) => {
  const {
    userName,
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const userExits = await userModel.findOne({
    $or: [{ userName, email }],
  });
  if (userExits) {
    return res.status(400).json({
      message: "User already exits",
    });
  }

  const hasPassword = await bcryptJs.hash(password, 10);

  const user = await userModel.create({
    userName,
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hasPassword,
  });

  const token = await jwt.sign(
    { id: user._id, userName: user.userName, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });

  res.status(201).json({
    message:"user register successfully 🎉🎉",
    user:{
        userName,
        email,
        firstName,
        lastName
    }
  })
};

module.exports = {
  registerController,
};
