const mongoose = require("mongoose");

const playListSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        default:""
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    songs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"song"
        }
    ],
    coverImage:{
        type:String,
        default:"",
    },

},{
    timestamps:true,
});

const playListModel = mongoose.model("playlist", playListSchema);

module.exports = playListModel;