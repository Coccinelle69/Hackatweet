const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  date: Date,
  hashtags: [{ type: mongoose.Schema.Types.ObjectId, ref: "hashtags" }],
  likes: Number,
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
