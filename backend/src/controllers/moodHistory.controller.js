const moodHistoryModel = require("../models/moodHistory.model");
const userModel = require("../models/user.model")

const createMood = async (req,res)=>{
    try {
        const {mood , source} = req.body;

        if(!mood){
            return res.status(400).json({
                message:"mood is required "
            });
        }
        // save mood history
         const moodEntry = await moodHistoryModel.create({
            userId:req.user.id,
            mood,
            source:source || "face",
         });

        //   Update user's last detected mood
        await userModel.findByIdAndUpdate(req.user.id,{
            lastDetectedMood : mood
        });

        return res.status(201).json({
            message:"mood saved successfully🎉",
            mood:moodEntry
         })
        
    } catch (error) {
        console.log("mood error", error);
        return res.status(500).json({
            message:"failed to save mood❌"
        })
    }
}
// get api 

const getMoodHistory = async (req,res)=>{
    try {
        const moods = await moodHistoryModel.find({
            userId:req.user.id,
        }).sort({createdAt: -1 });

        return res.status(200).json({
            message:" mood fetch successfully🎉",
            count:moods.length,
            moods
        })
    } catch (error) {
        console.log("failed" , error);
        return res.status(500).json({
            message:"failed to fetch mood history ❌ "
        })
    }
}

module.exports = {
    createMood,
    getMoodHistory
}