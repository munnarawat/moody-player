const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type:String,
      enum:["user", "admin"],
      default:"user"
    },
    lastDetectedMood:{
      type:String,
      enum:["happy", "sad","angry" ,"neutral", "surprised"]
    }
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
