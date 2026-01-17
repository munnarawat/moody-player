const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcryptJs = require("bcryptjs");

const registerController = async (req, res) => {
  try {
    const {
      userName,
      fullName,
      email,
      password,
    } = req.body;

    const firstName = fullName?.firstName;
    const lastName = fullName?.lastName;

    const userExits = await userModel.findOne({
      $or: [{ userName }, { email }],
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,  //local host 
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

    return res.status(201).json({
      message: "user register successfully 🎉🎉",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error ❌",
    });
  }
};

const loginController = async (req, res) => {

  try {
    const { identifier, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ userName: identifier }, { email: identifier }],
      })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid userName and email😖❌",
      });
    }

    const isValidPassword = await bcryptJs.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "invalid password ❌",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,  //local host 
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

    return res.status(200).json({
      message: "user LoggedIn successfully 🎉🤩",
      token: token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error ❌",
    });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    message: "current user fetched successfully 🎉",
    user: req.user,
  });
};
const logOutUserController = async (req, res) => {
try {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
   return res.status(200).json({
    message: "user logged out successfully 🎉",
  });
} catch (error) {
  return res.status(500).json({
    message:" Internal server error ❌",
  })
}
};

module.exports = {
  registerController,
  loginController,
  getCurrentUser,
  logOutUserController,
};
