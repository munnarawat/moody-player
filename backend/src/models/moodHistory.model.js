const mongoose = require("mongoose");

const MoodHistorySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    mood:{
        type:String,
        enum:["happy", "sad", "angry","neutral","surprised","romantic"],
        required:true,
    },
    source:{
        type:String,
        enum:["face","manual"],
        default:"face"
    }
},{
    timestamps:true
});

const moodHistoryModel = mongoose.model("moodHistory", MoodHistorySchema);

module.exports  = moodHistoryModel;
