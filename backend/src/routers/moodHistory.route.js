const express = require("express");
const {createMood,getMoodHistory} = require("../controllers/moodHistory.controller")
const {authMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();


// Save detected mood
router.post("/mood", authMiddleware, createMood)

// get mood history
router.get("/mood", authMiddleware , getMoodHistory)



module.exports = router;