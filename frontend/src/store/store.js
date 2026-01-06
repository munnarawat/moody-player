import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import moodReducer from "./moodSlice";
import songReducer from "./songSlice";
import playerReducer from "./playerSlice";


export const store =  configureStore({
    reducer:{
        auth:authReducer,
        mood:moodReducer,
        song:songReducer,
        player:playerReducer
    }
})