const asyncHandler = require("express-async-handler");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const User = require("../models/User");

const addTweet = asyncHandler(async (req, res, next) => {
  const { text, user, commentSecurity, followers, parentId } = req.body;

  let tweet;

  if (!parentId) {
    tweet = await Tweet.create({
      text,
      user,
      commentSecurity,
      followers,
    });
  } else {
    tweet = await Tweet.create({
      text,
      user,
      commentSecurity,
      followers,
      parentId,
    });

    const comment = await Tweet.updateOne(
      { _id: parentId },
      { $push: { comments: tweet._id } }
    );
  }

  res.status(200).json({
    success: true,
    data: tweet,
  });
});

const getTweets = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const tweets = await Tweet.find({
    $or: [
      { followers: { $in: [mongoose.Types.ObjectId(userId)] } },
      { user: userId },
    ],
  })
    .populate("user")
    .sort({ createdAt: -1 });

  let data = [...tweets].filter((tweet) => !tweet.parentId);

  res.status(200).json({
    success: true,
    data,
  });
});

const enjoyTweet = asyncHandler(async (req, res, next) => {
  const tweetId = req.body.tweetId;
  const userId = req.body.userId;

  const count = await Tweet.find({
    _id: tweetId,
    enjoys: { $in: [userId] },
  }).countDocuments();

  let enjoys;

  if (count > 0) {
    await Tweet.updateOne({ _id: tweetId }, { $pull: { enjoys: userId } });
  } else {
    await Tweet.updateOne({ _id: tweetId }, { $push: { enjoys: userId } });
  }
});

const getSingleTweet = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id).populate("user comments");

  res.status(200).json({
    success: true,
    data: tweet,
  });
});

const getComments = asyncHandler(async (req, res, next) => {
  const comments = await Tweet.find({
    parentId: mongoose.Types.ObjectId(req.params.tweetId),
  }).populate({ path: "user parentId", populate: { path: "user" } });
  // .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: comments,
  });
});

const getTweetsOfUser = asyncHandler(async (req, res, next) => {
  console.log("asşldkfjasşldfkj");
});

module.exports = {
  addTweet,
  getTweets,
  enjoyTweet,
  getSingleTweet,
  getComments,
  getTweetsOfUser,
};
