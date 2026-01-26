const express = require("express");
const multer = require("multer");
const router = express.Router();
const {createSong,getSong,getSongsByMood} = require("../controllers/song.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware")


const upload = multer({storage:multer.memoryStorage()});

// post 
router.post("/songs", authMiddleware , adminMiddleware,  upload.fields([
    {name:'audio',maxCount:1},
    {name:'image',maxCount:1},
]), createSong)

router.get("/songs", getSong)

router.get("/songs/mood/:mood",getSongsByMood)


module.exports = router;