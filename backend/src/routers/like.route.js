const express = require("express");
const {toggleLikeSongs, getLikedSong} = require("../controllers/like.controller");
const { authMiddleware}= require("../middleware/auth.middleware")

const routes = express.Router();

// toggle - post
routes.post("/toggle", authMiddleware, toggleLikeSongs);

// getSongs
routes.get("/", authMiddleware, getLikedSong)

module.exports =routes;