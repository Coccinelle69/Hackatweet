var express = require("express");
var router = express.Router();
var moment = require("moment");
moment().format();

require("../models/connection");
const Tweet = require("../models/tweets");
const Hashtag = require("../models/hashtags");
// const { checkBody } = require("../modules/checkBody");
// const User = require("../models/users");

router.get("/", async (req, res) => {
  const hashtags = await Hashtag.find();
  if (hashtags.length > 0) {
    return res.json({ result: true, hashtags });
  }

  return res.json({
    result: false,
    message: "No tweets found with #hashtagname",
  });
});

router.get("/:hashtag", async (req, res) => {
  const searchHashtag = `#${req.params.hashtag}`;
  const hashtag = await Hashtag.findOne({ name: searchHashtag });

  console.log(searchHashtag);
  const tweets = await Tweet.find({
    hashtags: hashtag.id, // Query for tweets where the hashtag name matches
  }).populate({
    path: "author",
    select: "username firstname image",
  });

  console.log(tweets);

  const sortedTweets = tweets.sort((a, b) => {
    return moment(b.date).diff(a.date);
  });

  const updateTweets = sortedTweets.map((tweet) => {
    let howLongAgo = moment(tweet.date).fromNow();
    return {
      ...tweet.toObject(), // Convert Mongoose document to plain JavaScript object
      howLongAgo,
    };
  });

  if (tweets.length > 0) {
    res.json({ result: true, tweets: updateTweets });
  } else {
    res.json({
      result: false,
      message: `No tweets found with ${hashtag}`,
    });
  }
});

module.exports = router;
