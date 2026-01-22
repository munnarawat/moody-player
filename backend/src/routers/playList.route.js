const express = require("express");
const {createPlayList, getUserPlayList,getPlaylistById, addSongToPlaylist} = require("../controllers/playList.controller");
const {authMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

// post 
router.post("/",authMiddleware, createPlayList);

// get playlist
router.get("/", authMiddleware,getUserPlayList )


router.post("/add-song", authMiddleware, addSongToPlaylist);
router.get("/:id", authMiddleware, getPlaylistById);

module.exports = router;
