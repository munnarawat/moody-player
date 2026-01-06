import { createSlice } from "@reduxjs/toolkit";

const moodSlice  = createSlice({
    name:"mood",
    initialState:{
        currentMood:null
    },
    reducers:{
        setMood:(state,action)=>{
            state.currentMood = action.payload;

        },
    },
}) ;

export const {setMood} = moodSlice.actions;
 export default  moodSlice.reducer