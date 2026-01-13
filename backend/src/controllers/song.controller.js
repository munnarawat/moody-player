const songModel = require("../models/songs.model");
const uploadFile = require("../service/storage.service");

const createSong = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Audio file required ❌",
      });
    }
    const { title, artist, mood, imageUrl, genre, duration } = req.body;
    const fileData = await uploadFile(req.file);

    const song = await songModel.create({
      title,
      artist,
      audioUrl: fileData.url,
      imageUrl: fileData.imageUrl,
      mood: Array.isArray(mood) ? mood : mood.split(","),
      genre,
      duration,
    });
    return res.status(201).json({
      message: "Song created successfully 🎉",
      song,
    });
  } catch (error) {
     console.error("SONG UPLOAD ERROR ", error);
    return res.status(500).json({
      message: "song upload failed ❌",
    });
  }
};

const getSong = async (req, res) => {
  try {
    const { mood } = req.query;
    let filter = { isActive: true };
    if (mood) {
      filter.mood = { $in: [mood] };
    }
    const song = await songModel.find(filter);
    res.status(200).json({
      message: "song fetch successfully 🎉",
      song,
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to fetch song❌",
    });
  }
};


module.exports = {
    createSong,
    getSong
}