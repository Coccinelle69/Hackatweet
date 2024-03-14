import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Store likes for each tweet by tweet ID
  likedTweets: [],
};

export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    like: (state, action) => {
      console.log("Like payload:", action.payload);

      state.likedTweets.push(action.payload);
    },
    unlike: (state, action) => {
      state.likedTweets = state.likedTweets.filter(
        (tweet) => tweet !== action.payload
      );
    },
  },
});

export const { unlike, like } = likesSlice.actions;
export default likesSlice.reducer;
