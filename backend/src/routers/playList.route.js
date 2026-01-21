const express = require("express");
const {createPlayList, getUserPlayList} = require("../controllers/playList.controller");
const {authMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

// post 
router.post("/",authMiddleware, createPlayList);

// get playlist
router.get("/", authMiddleware,getUserPlayList )

module.exports = router;
