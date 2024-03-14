var express = require("express");
var router = express.Router();
var moment = require("moment");
moment().format();

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  if (!checkBody(req.body, ["firstname", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const existingUser = await User.findOne({ username: req.body.username });

  if (!existingUser) {
    const hash = bcrypt.hashSync(req.body.password, 12);

    const newUser = await new User({
      firstname: req.body.firstname,
      username: req.body.username,
      token: uid2(32),
      password: hash,
      likedTweets: [],
      image: null,
    }).save();

    return res.json({ result: true, token: newUser.token, user: newUser });
  }

  return res.json({ result: false, error: "User already exists" });
});

router.post("/signin", async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const existingUser = await User.findOne({ username: req.body.username });

  if (
    existingUser &&
    bcrypt.compareSync(req.body.password, existingUser.password)
  ) {
    return res.json({
      result: true,
      token: existingUser.token,
      user: existingUser,
    });
  }

  return res.json({ result: false, error: "User not found or wrong password" });
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({ _id: userId });

  res.json({ result: true, user });
});

router.post("/upload/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (!req.files || !req.files.image) {
    return res.status(400).json({ result: false, error: "No file uploaded" });
  }
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.image.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { image: resultCloudinary.secure_url },
      { new: true } // To return the updated document
    );
    res.json({
      result: true,
      url: resultCloudinary.secure_url,
      user: updatedUser,
    });
  } else {
    res.json({ result: false, error: resultMove });
  }

  fs.unlinkSync(photoPath);
});

module.exports = router;
