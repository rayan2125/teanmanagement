import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'Auth',
    initialState: {
        isLoggedIn: false,
        authData: null,
        adduser: {}, // 
        userImg: null, 
        userProfile: {},
        userId:null,
    },
    reducers: {
        setAuthdata(state, action) {
            state.isLoggedIn = true;
            state.authData = action.payload;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.authData = null;
            state.adduser = {};
            state.userImg = null; 
        },
        setUser(state, action) {
            state.adduser = action.payload; 
        },
        setUserImg(state, action) {
            state.userImg = action.payload; 
        },
        setUserId(state, action) {
            state.userId = action.payload;
        },
       
    },
});

export const { setAuthdata, logout, setUser, setUserImg, setProfile,setUserId } = authSlice.actions;

export default authSlice.reducer;
