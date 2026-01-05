const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    mood: {
      type: [String],
      enum: ["happy", "sad", "angry", "neutral", "surprised", "romantic"],
      required: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, //second
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const songModel = mongoose.model("song", songSchema);

module.exports = songModel;
