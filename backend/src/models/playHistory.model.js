const mongoose = require("mongoose");

const playHistorySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    songId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"song",
        trim:true,
    },
    mood:{
        type:String,
        enum: ["happy", "sad", "angry", "neutral", "surprised", "romantic"],
        required:true
    },
    playAt:{
        type:Date,
        default:Date.now,
    }
},{
    timestamps:true,
});

const playHistoryModel = mongoose.model("playHistory", playHistorySchema);

module.exports = playHistoryModel;