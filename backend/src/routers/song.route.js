const express = require("express");
const multer = require("multer");
const router = express.Router();
const {createSong,getSong} = require("../controllers/song.controller");
const {authMiddleware} = require("../middleware/auth.middleware")


const upload = multer({storage:multer.memoryStorage()});

// post 
router.post("/songs", authMiddleware ,  upload.single("audio"), createSong)

router.get("/songs", getSong)


module.exports = router;