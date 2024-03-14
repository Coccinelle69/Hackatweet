import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hashtags: [],
};

export const hashtagSlice = createSlice({
  name: "hashtags",
  initialState,
  reducers: {
    addHashtag: (state, action) => {
      const { text } = action.payload;
      const existingHashtag = state.hashtags.find(
        (hashtag) => hashtag.text === text
      );
      if (existingHashtag) {
        existingHashtag.count += 1;
      } else {
        state.hashtags.push({ text, count: 1 });
      }
    },
  },
});

export const { addHashtag } = hashtagSlice.actions;
export default hashtagSlice.reducer;
