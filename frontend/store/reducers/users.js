import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    firstname: null,
    user: null,
    image: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.firstname = action.payload.firstname;
      state.value.user = action.payload.user;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.firstname = null;
      state.value.user = null;
      state.value.image = null;
    },
    changeUserPhoto(state, action) {
      state.value.image = action.payload;
    },
  },
});

export const { login, logout, changeUserPhoto } = userSlice.actions;
export default userSlice.reducer;
