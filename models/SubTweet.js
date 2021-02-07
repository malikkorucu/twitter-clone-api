const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubTweet = new Schema({
  createdAt: {
    type: Date,
    default: Date,
  },
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
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "default_tweet_img.jpg",
  },
  parentId: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

});

module.exports = mongoose.model("SubTweet", SubTweet);
