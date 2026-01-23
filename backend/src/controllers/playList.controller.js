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

    const rawPlaylist = await playListModel.findById(id);
    // console.log("🔍 Raw Playlist ,from DB:", rawPlaylist);
     if (!rawPlaylist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const playlist = await playListModel.findById(id).populate("songs");
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

    // 1. Validate Input
    if (!playlistId || !songId) {
      return res.status(400).json({ message: "Playlist ID and Song ID required" });
    }
    const playlist = await playListModel.findById(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (!playlist.songs) {
      playlist.songs = [];
    }
    const isDuplicate = playlist.songs.some(id => id.toString() === songId);
    if (isDuplicate) {
      return res.status(400).json({ message: "Song already in playlist" });
    }``
    playlist.songs.push(songId);
    
    await playlist.save();

    console.log("✅ Song Added:", songId, "to Playlist:", playlist.name); // Debug log

    res.status(200).json({ 
        message: "Song added to playlist! 🎵", 
        playlist 
    });

  } catch (error) {
    console.error("Add Song Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const deletePlaylist = async (req,res)=>{
  try {
     const {id} = req.params;
     const userId = req.user._id;
     const playlist = await playListModel.findOneAndDelete({
      _id:id,
      owner:userId,
     });
     if(!playlist){
      return res.status(404).json({
        message:"playlist not found or unauthorized "
      });
     }
     res.status(200).json({
      message:"playlistDeleted Successfully ✅"
     });
   } catch (error) {
    return res.status(500).json({
      message:"Server error ",
      error:error.message
    })
  }
}
const removeSongFromPlayList = async (req,res)=>{
  try {
    const {playlistId, songId} =req.body;
    const playlist = await playListModel.findByIdAndUpdate(
      playlistId,
      {$pull: {songs:songId}},
      {new:true}
    ).populate("songs");

    if(!playlist){
      return res.status(404).json({
        message:"playlist not found ❌"
      });
    }
    res.status(200).json({
      message:"song Remove from playlist ❌",
      playlist
    })
  } catch (error) {
    return res.status(500).json({message:"server Error", error:error.message});
  }
}
module.exports = {
  createPlayList,
  getUserPlayList,
  getPlaylistById,
  addSongToPlaylist,
  deletePlaylist,
  removeSongFromPlayList
};
