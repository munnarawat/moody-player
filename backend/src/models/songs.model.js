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
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80",
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

const songModel = mongoose.model("songs", songSchema);

module.exports = songModel;
