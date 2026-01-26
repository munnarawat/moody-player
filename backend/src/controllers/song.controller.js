const songModel = require("../models/songs.model");
const uploadFile = require("../service/storage.service");

const createSong = async (req, res) => {
  try {
    if (!req.files || !req.files.audio || !req.files.image) {
      return res.status(400).json({
        message: " both files are  required ❌",
      });
    }
    const { title, artist, mood, genre, duration } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    const [audioResult, imageResult] = await Promise.all([
      uploadFile(audioFile),
      uploadFile(imageFile),
    ]);

    const song = await songModel.create({
      title,
      artist,
      audioUrl: audioResult.url,
      imageUrl: imageResult.url,
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

const getSongsByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    if (!mood) {
      return res.status(400).json({ message: "mood are required" });
    }
    const searchMood = mood.toLowerCase();
    const songs = await songModel.find({
      mood: searchMood,
    });
    if (!songs || songs.length === 0) {
      return res.status(200).json({
        message: `No songs found for ${searchMood}`,
        songs: [],
      });
    }
    return res.status(200).json({
      message:`${searchMood} mood fetched successfully`,
      songs
    })
  } catch (error) {
    console.error("Mood Fetch Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createSong,
  getSong,
  getSongsByMood
};
