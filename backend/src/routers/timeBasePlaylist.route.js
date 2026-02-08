const express = require("express");
const router = express.Router();
const {createTimeBasePlaylist, getTimeBasePlaylist, addSongToPlaylist} = require("../controllers/timeBasePlaylist.Controller")
const multer = require("multer");

const upload = multer({storage:multer.memoryStorage});

// post router
router.post("/create", upload.single("coverImage"),createTimeBasePlaylist);

// add song playlist 
router.post("/add-song", addSongToPlaylist)
// get
router.get("/get-by-time", getTimeBasePlaylist)



module.exports = router;