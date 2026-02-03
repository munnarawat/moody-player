import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token:localStorage.getItem("token")|| null,
    isAuthenticated:!!localStorage.getItem("token"),
  },
  reducers: {
    loginSuccess:(state,action)=>{
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);

    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
      updateUserLikedSongs: (state, action) => {
      const { songId, isLiked } = action.payload;

      if (state.user) {
        if (!state.user.likedSongs) {
          state.user.likedSongs = [];
        }
        if (isLiked) {
          const exists = state.user.likedSongs.some((item) => {
            const id = typeof item === "string" ? item : item._id;
            return id === songId;
          });
          if (!exists) {
            state.user.likedSongs.push(songId);
          }
        } else {
          state.user.likedSongs = state.user.likedSongs.filter((item) => {
            const id = typeof item === "string" ? item : item._id;
            return id !== songId;
          });
        }
      }
    },
  },
});

export const {loginSuccess, setUser, logOut, updateUserLikedSongs } = authSlice.actions;
export default authSlice.reducer;