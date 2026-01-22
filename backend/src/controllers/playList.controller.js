const playListModel = require("../models/playlist.model");
const songModel = require("../models/songs.model");
const createPlayList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({
        message: "Playlist name are required",
      });
    }
    const newPlaylist = new playListModel({
      name,
      description,
      owner: userId,
      songs: [],
    });
    await newPlaylist.save();
    return res.status(201).json({
      message: "playList created successfully🎉",
      playlists: newPlaylist,
    });
  } catch (error) {
    console.error("Create Playlist Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const getUserPlayList = async (req, res) => {
  try {
    const userId = req.user._id;
    const playlists = await playListModel
      .find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("songs");

    res.status(200).json({
      message: "Playlist fetched",
      playlists,
    });
  } catch (error) {
    console.error("Fetch Playlist Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await playListModel.findById(id).populate("songs");
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json({
      message: "playlist fetched",
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await playListModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        message: "playlist not found",
      });
    }
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({
        message: "song already in playlist",
      });
    }
    playlist.songs.push();
    await playlist.save();
    res.status(200).json({ message: "Song added to playlist! 🎵", playlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.exports = {
  createPlayList,
  getUserPlayList,
  getPlaylistById,
  addSongToPlaylist
};
