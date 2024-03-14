var express = require("express");
var router = express.Router();
var moment = require("moment");
moment().format();

require("../models/connection");
const Tweet = require("../models/tweets");
const Hashtag = require("../models/hashtags");
const { checkBody } = require("../modules/checkBody");
const User = require("../models/users");

router.post("/", async (req, res) => {
  if (!checkBody(req.body, ["text", "hashtags", "authorId"])) {
    res.json({ result: false, error: "Missing text or tweet title" });
    return;
  }

  let date = moment();

  const hashtags = req.body.hashtags;

  for (const hashtag of hashtags) {
    const existingHashtag = await Hashtag.findOne({ name: hashtag });
    if (!existingHashtag) {
      let newHashtag = new Hashtag({ name: hashtag, count: 1 });
      await newHashtag.save();
    } else {
      await Hashtag.updateOne({ name: hashtag }, { $inc: { count: 1 } });
    }
  }
  const searchedFetchedHashtags = await Hashtag.find({
    name: { $in: hashtags },
  });
  const newTweet = new Tweet({
    text: req.body.text,
    author: req.body.authorId,
    date: date,
    hashtags: searchedFetchedHashtags,
    likes: 0,
  }).save();

  res.json({
    result: true,
    tweet: newTweet,
    hashtags: searchedFetchedHashtags,
  });
});

//route tweets méthode GET pour afficher les tweets sur la page principale

router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate({
        path: "author",
        select: "username firstname image",
      })
      .populate({
        path: "hashtags",
        select: "name count",
      });

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
      res.json({ result: false, message: "No tweet found" });
    }
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ result: false, message: "Internal Server Error" });
  }
});

//route Like pour liker un post

router.post("/update/:tweetId", async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const count = req.body.count;
    let userLiked = req.body.userLiked;
    // console.log(userLiked);

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res
        .status(404)
        .json({ result: false, message: "Tweet not found" });
    }

    const user = await User.findOne({ _id: userLiked.user._id });
    console.log(user);
    // const alreadyLikedUser = await User.findOne({ likedBy: tweetId });

    await Tweet.updateOne({ _id: tweetId }, { $inc: { likes: count } });

    if (count === 1) {
      // If count is 1, add the user to likedBy array
      await Tweet.updateOne(
        { _id: tweetId },
        { $addToSet: { likedBy: userLiked.user._id } } // Use $addToSet to add only if not already present
      );
      await User.updateOne(
        { _id: userLiked.user._id },
        { $addToSet: { likedTweets: tweet._id } } // Use $addToSet to add only if not already present
      );
    } else if (count === -1) {
      // If count is -1, remove the user from likedBy array
      await Tweet.updateOne(
        { _id: tweetId },
        { $pull: { likedBy: userLiked.user._id } }
      );
      await User.updateOne(
        { _id: userLiked.user._id },
        { $pull: { likedTweets: tweet._id } } // Use $addToSet to add only if not already present
      );
    }

    const tweets = await Tweet.find();

    // Fetch the updated tweet after updating the likes
    const updatedTweet = await Tweet.findById(tweetId);
    res.json({ result: true, likes: updatedTweet.likes, tweets, user: user });
  } catch (error) {
    console.error("Error updating tweet likes:", error);
    res.status(500).json({ result: false, message: "Internal Server Error" });
  }
});

// route tweets avec méthode DELETE pour effacer un tweet

router.delete("/:tweetId", async (req, res) => {
  const tweet = await Tweet.findOne({ _id: req.params.tweetId });
  const hashtags = tweet.hashtags.map((hashtag) => hashtag._id); // Extracting the IDs

  console.log(hashtags);

  await Hashtag.updateMany(
    { _id: { $in: hashtags }, count: { $gt: 0 } }, // Increment count for hashtags with count > 0
    { $inc: { count: -1 } }
  );

  // Remove hashtags with count = 0
  await Hashtag.deleteMany({ _id: { $in: hashtags }, count: 0 });

  const data = await Tweet.deleteOne({ _id: req.params.tweetId });

  if (data.deletedCount > 0) {
    res.json({ result: true, message: "Tweet effacé" });
  } else {
    res.json({ result: false });
  }
});

//   route tweets méthode GET pour rechercher des tweets (optionnel)

module.exports = router;
