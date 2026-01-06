const express = require("express");
const {authMiddleware} = require("../middleware/auth.middleware")
const {createPlayHIstory,getPlayHistory} = require("../controllers/playHistory.controller")

const router = express.Router();

// post
router.post("/play", authMiddleware , createPlayHIstory);

// get user play history 
router.get("/play/history", authMiddleware, getPlayHistory)


module.exports = router;