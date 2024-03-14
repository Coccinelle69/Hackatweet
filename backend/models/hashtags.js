const mongoose = require("mongoose");

const hashtagSchema = mongoose.Schema({
	name: String,
	count: Number
	
});

const Hashtag = mongoose.model("hashtags", hashtagSchema);

module.exports = Hashtag;
