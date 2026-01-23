const express = require("express");
const {createPlayList, getUserPlayList,getPlaylistById, addSongToPlaylist , removeSongFromPlayList, deletePlaylist} = require("../controllers/playList.controller");
const {authMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

// post 
router.post("/",authMiddleware, createPlayList);

// get playlist
router.get("/", authMiddleware,getUserPlayList )


router.post("/add-song", authMiddleware, addSongToPlaylist);
router.get("/:id", authMiddleware, getPlaylistById);

router.delete("/:id",authMiddleware, deletePlaylist);
router.put("/remove-song", authMiddleware, removeSongFromPlayList);

module.exports = router;
