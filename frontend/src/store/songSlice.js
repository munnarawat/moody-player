import { createSlice } from "@reduxjs/toolkit";

const songSlice = createSlice({
    name:"song",
    initialState:{
       recommendations:[],
    },
    reducers:{
        setRecommendation:(state,action)=>{
            state.recommendations = action.payload;
        },
    },
});
export const {setRecommendation} = songSlice.actions;
export default  songSlice.reducer