const timeBasePlayListModel = require("../models/timeBasePlaylist.model");
const uploadFile = require("../service/storage.service");

const createTimeBasePlaylist = async (req, res) => {
  try {
    const { name, description, gradient, timeCategory } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "playlist name are required!",
      });
    }
    let coverImageUrl = "";
    if (req.file) {
      try {
        const uploadResult = await uploadFile(req.file);
        coverImageUrl = uploadResult.url;
      } catch (error) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }
    const newPlaylist = new timeBasePlayListModel({
      name,
      description,
      gradient,
      timeCategory,
      coverImage: coverImageUrl,
    });
    await newPlaylist.save();
    return res.status(201).json({
      message: "playList created successfully🎉",
      playlists: newPlaylist,
    });
  } catch (error) {
    console.error("Create Playlist Error:", error);
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};
const getTimeBasePlaylist = async (req, res) => {
  try {
    const currentHours = new Date().getHours();
    let timeCategory = "night";
    let greeting = "Good Night";
    if (currentHours >= 5 && currentHours < 12) {
      timeCategory = "morning";
      greeting = "Good Morning";
    } else if (currentHours >= 12 && currentHours < 17) {
      timeCategory = "afternoon";
      greeting = "Good Afternoon";
    } else if (currentHours >= 17 && currentHours < 21) {
      timeCategory = "evening";
      greeting = "Good Evening";
    }

    const playlist = await timeBasePlayListModel
      .find({
        timeCategory: { $in: [timeCategory, "any"] },
      })
      .populate("songs");

    return res.status(200).json({
      message: "playlist Fetched Successfully",
      greeting: greeting,
      category: timeCategory,
      data: playlist,
    });
  } catch (error) {
    console.error("Error fetching time-based playlist:", error);
    return res.status(500).json({
      message: "Server error while fetching playlists",
      error: error.message,
    });
  }
};
const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songIds } = req.body;
    if (!playlistId || !songIds || !Array.isArray(songIds)) {
      return res.status(400).json({
        message: "playlistId and SongId are require!",
      });
    }
    const updatePlaylist = await timeBasePlayListModel
      .findByIdAndUpdate(
        playlistId,
        {
          $addToSet: {
            songs: { $each: songIds },
          },
        },
        { new: true },
      )
      .populate("songs");

    if (!updatePlaylist) {
      return res.status(404).json({
        message: "playlist not found",
      });
    }
    return res.status(200).json({
      message: `${songIds.length}song added Successfully✅`,
      playlist: updatePlaylist,
    });
  } catch (error) {
    console.error("Add Song Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// ... baaki imports ke sath

const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await timeBasePlayListModel.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({
      message: "Playlist fetched",
      data: playlist,
    });
  } catch (error) {
    console.error("Error fetching single playlist:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  createTimeBasePlaylist,
  getTimeBasePlaylist,
  addSongToPlaylist,
  getPlaylistById,
};
