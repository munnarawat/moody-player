const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadFile = require("../service/storage.service")
const songModel = require("../models/songs.model")

const upload = multer({storage:multer.memoryStorage()});
// post 
router.post("/songs", upload.single("audio"), async(req,res)=>{
    const fileData = await uploadFile(req.file);
    
    const song = await songModel.create({
        title:req.body.title,
        artist:req.body.artist,
        audio:fileData.url,
        mood:req.body.mood
    })
    res.status(201).json({
        message:"song created successfully🎉",
        song:song
    })
    
})

router.get("/songs",async (req,res)=>{
    const {mood} = req.query;
    const songs = await songModel.find({
        mood:mood
    });
    res.status(200).json({
        message:"songs fetched successfully🎉"  ,
        songs:songs
    })
})


module.exports = router;