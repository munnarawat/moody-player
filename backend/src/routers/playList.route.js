const express = require("express");
const {createPlayList, getUserPlayList,getPlaylistById, addSongToPlaylist , removeSongFromPlayList, deletePlaylist} = require("../controllers/playList.controller");
const {authMiddleware} = require("../middleware/auth.middleware")
const multer = require("multer");
const router = express.Router();


const upload = multer({storage:multer.memoryStorage()})
// post 
router.post("/",authMiddleware,upload.single("coverImage"), createPlayList);

// get playlist
router.get("/", authMiddleware,getUserPlayList )
 

router.post("/add-song", authMiddleware, addSongToPlaylist);
router.get("/:id", authMiddleware, getPlaylistById);

router.delete("/:id",authMiddleware, deletePlaylist);
router.put("/remove-song", authMiddleware, removeSongFromPlayList);

module.exports = router;
