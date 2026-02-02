import { createSlice } from "@reduxjs/toolkit";
import { step } from "@tensorflow/tfjs";

const songSlice = createSlice({
  name: "song",
  initialState: {
    recommendations: [],
    currentSong: null,
    isPlaying: false,
    currentIndex: 0,
    isShuffle: false,
    repeatMode: "off",
  },
  reducers: {
    setRecommendation: (state, action) => {
      state.recommendations = action.payload;
      state.currentIndex = 0;
    },
    playSong: (state, action) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
      const index = state.recommendations.findIndex(
        (song) => song._id === action.payload._id,
      );
      state.currentIndex = index !== -1 ? index : 0;
    },
    // play pause toggle
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    toggleRepeat: (state) => {
      if (state.repeatMode === "off") state.repeatMode = "all";
      else if (state.repeatMode === "all") state.repeatMode = "one";
      else state.repeatMode = "off";
    },
    // next song logic
    nextSong: (state) => {
      if (state.recommendations.length === 0) return;

      let nextIndex;
      // Agar Shuffle On hai -> Random Index
      if (state.isShuffle) {
        nextIndex = Math.floor(Math.random() * state.recommendations.length);
      }
      // Agar Shuffle Off hai -> Normal Next
      else {
        nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.recommendations.length) {
          if (state.repeatMode === "all" || state.repeatMode === "one") {
            nextIndex = 0;
          } else {
            nextIndex = 0;
            state.isPlaying = false;
          }
        }
      }

      state.currentIndex = nextIndex;
      state.currentSong = state.recommendations[nextIndex];
      state.isPlaying = true;
    },
    //
    prevSong: (state) => {
      if (state.recommendations.length > 0) {
        if (state.currentIndex > 0) {
          state.currentIndex -= 1;
        } else {
          state.currentIndex = state.recommendations.length - 1;
        }
        state.currentSong = state.recommendations[state.currentIndex];
        state.isPlaying = true;
      }
    },
  },
});
export const { setRecommendation, playSong, togglePlay,toggleRepeat, toggleShuffle, nextSong, prevSong } =
  songSlice.actions;
export default songSlice.reducer;
