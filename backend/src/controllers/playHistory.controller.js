const playHistoryModel = require("../models/playHistory.model");
const songModel = require("../models/songs.model");

// create playHistory
const createPlayHIstory = async (req, res) => {
  try {
    const { songId, mood } = req.body;

    if (!songId || !mood) {
      return res.status(400).json({
        message: "songId and Mood are required ",
      });
    }

    let song = await songModel.findById(songId);

    if (!song) {
      return res.status(404).json({
        message: "song not found❌",
      });
    }
    const play = await playHistoryModel.create({
      userId: req.user.id,
      songId,
      mood,
    });
    return res.status(201).json({
        message:"play History saved 🎶",
        play
    })
  } catch (error) {
    console.log("play error", error);
    return res.status(500).json({
      message: "failed to Create playHistory",
      error:error.message
    });
  }
};


// get play history
const getPlayHistory = async (req,res) =>{
    try {
        const history = await playHistoryModel.find({
            userId:req.user.id
        })
        .populate("songId", "title artist audioUrl mood")
        .sort({playedAt: -1})

        return res.status(200).json({
            message:"play History fetch 🎶",
            count:history.length,
            history
        });

    } catch (error) {
        console.log("fetch error", error); 
        return res.status(500).json({
            message:"failed to fetch playHistory ❌"
        })
        
    }
}
module.exports = {
  createPlayHIstory,
  getPlayHistory
};
