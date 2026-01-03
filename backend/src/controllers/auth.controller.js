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

  const token = jwt.sign(
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
    message: "user register successfully 🎉🎉",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      fullName: user.fullName,
    },
  });
};

const loginController = async (req, res) => {
  const { userName, email, password } = req.body;

  const user = await userModel
    .findOne({
      $or: [{ userName, email }],
    })
    .select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid userName and email😖❌",
    });
  }

  const isValidPassword = bcryptJs.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "invalid password ❌",
    });
  }
  const token = jwt.sign(
    {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });

  res.status(200).json({
    message: "user LoggedIn successfully 🎉🤩",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      fullName: user.fullName,
    },
  });
};

const getCurrentUser = async (req, res) => {
  res.status(200).json({
    message: "current user fetched successfully 🎉",
    user: req.user,
  });
};
const logOutUserController = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(400).json({
      message: "User is not logged in ❌",
    });
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({
    message: "user logged out successfully 🎉",
  });
};

module.exports = {
  registerController,
  loginController,
  getCurrentUser,
  logOutUserController
};
