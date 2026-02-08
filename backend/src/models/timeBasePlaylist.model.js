const mongoose = require("mongoose");

const timeBasePlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  gradient: {
    type: String,
    default: "from-indigo-500 to-purple-900",
  },
  timeCategory: {
    type: String,
    enum: ["morning", "afternoon", "evening", "night", "any"],
    default: "any",
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "songs",
    },
  ],
  coverImage: {
    type: String,
    default: "",
  },
});
const timeBasePlayListModel = mongoose.model(
  "timeBasePlayList",
  timeBasePlaylistSchema,
);
module.exports = timeBasePlayListModel;
