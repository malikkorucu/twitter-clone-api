const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Tweet = new Schema({
  createdAt: {
    type: Date,
    default: Date,
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tweet",
    },
  ],
  retweets: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  enjoys: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  commentSecurity: {
    type: String,
    enum: ["public", "only_followers", "known_users"],
    default: "public",
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "default_tweet_img.jpg",
  },
  parentId: {
    type: mongoose.Schema.ObjectId,
    ref:"Tweet"
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  subTweets: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tweet",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User.followers",
    },
  ],
});


module.exports = mongoose.model("Tweet", Tweet);