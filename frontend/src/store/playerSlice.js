import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
    name:"player",
    initialState:{
        currentSong :null,
        isPlaying: false,
    },
    reducers:{
        setCurrentSong:(state,action)=>{
            state.currentSong = action.payload;
        },
        setPlaying:(state,action)=>{
            state.isPlaying = action.payload;
        },
    },
});

export const {setCurrentSong, setPlaying} = playerSlice.actions;
export default playerSlice.reducer