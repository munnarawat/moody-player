import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticated: false
    },
    reducers:{
        setUser:(state, action)=>{
            state.user = action.payload;
            state.isAuthenticated = true
        },
        logOut:(state) => {
            state.user = null,
            state.isAuthenticated = false;
        },
    },
});

export const {setUser, logOut} = authSlice.actions;
export default authSlice.reducer;