const userModel = require("../models/user.model");

const toggleLikeSongs = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    const isLiked = user.likedSongs.some(id => id && id.toString() === songId);
    if (isLiked) {
      user.likedSongs = user.likedSongs.filter(
        (id) =>id && id.toString() !== songId,
      );
      await user.save();
      return res.status(200).json({
        message:"Remove from like Songs 💔",
        isLiked:false
      });
    }else{
        user.likedSongs.push(songId);
        await user.save();
        return res.status(200).json({
            message:"Added to liked Songs❤️ ",
            isLiked:true
        });
    }
  } catch (error) {
    console.error("Like Toggle Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getLikedSong = async(req,res)=>{
    try {
        const  user = await userModel.findById(req.user._id)
        .populate("likedSongs");
        res.status(200).json({
            message:"liked Songs are fetched🎉",
            likedSongs:user.likedSongs,
        });
    } catch (error) {
        console.error("Fetch Liked Songs Error:", error);
    res.status(500).json({ message: "Server Error" });
    }
}

module.exports ={
    toggleLikeSongs,
    getLikedSong
}