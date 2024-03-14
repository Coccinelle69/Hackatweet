const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  username: String,
  token: String,
  password: String,
  likedTweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
  image: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
