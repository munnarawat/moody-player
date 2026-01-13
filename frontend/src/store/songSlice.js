import { createSlice } from "@reduxjs/toolkit";
import { step } from "@tensorflow/tfjs";

const songSlice = createSlice({
    name:"song",
    initialState:{
       recommendations:[],
       currentSong: null,
       isPlaying: false,
       currentIndex: 0,
    },
    reducers:{
        setRecommendation:(state,action)=>{
            state.recommendations = action.payload;
            state.currentIndex = 0;
        },
        playSong:(state,action)=>{
            state.currentSong = action.payload;
            state.isPlaying = true;
            const index = state.recommendations.findIndex((song)=> song.id === action.payload.id);
            state.currentIndex = index !== -1 ? index:0;
        },
        // play pause toggle
        togglePlay:(state)=>{
            state.isPlaying = !state.isPlaying;
        },
        // next song logic
        nextSong:(state)=>{
            if(state.recommendations.length > 0){
                if(state.currentIndex <state.recommendations.length - 1 ){
                    state.currentIndex +=1;
                }else{
                    state.currentIndex = 0;
                }
                state.currentSong = state.recommendations[state.currentIndex];
                state.isPlaying = true;
            }
        },
        // 
        prevSong:(state)=>{
            if(state.recommendations.length>0){
                if(state.currentIndex > 0){
                    state.currentIndex -=1;
                }else{
                    state.currentIndex = state.recommendations.length-1;
                }
                state.currentSong = state.recommendations[state.currentIndex];
                state.isPlaying = true;
            }
        }
    },
});
export const {setRecommendation, playSong, togglePlay, nextSong , prevSong} = songSlice.actions;
export default  songSlice.reducer