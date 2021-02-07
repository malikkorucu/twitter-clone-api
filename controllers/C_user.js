const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const searchable = require("mongoose-regex-search");
const CustomError = require("../helpers/error/CustomError");
const { find } = require("../models/Tweet");
const Conversation = require("../models/Conversation");
const io = require("../helpers/socket");
const Message = require("../models/Message");
const { sockets } = require("../helpers/socket");
const { onConnect } = require("../server");
const Notification = require('../models/Notification')


const getSingleUser = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  res.status(200).json({
    success: true,
    data: user,
  });
});

const followUnfollowUser = asyncHandler(async (req, res, next) => {
  const profileId = req.body.profileId;
  const userId = req.params.id;

  if (JSON.stringify(req.user.id) !== JSON.stringify(userId)) {
    return next(new CustomError("kendini takip edemezsin"), 400);
  }

  const count = await User.find({
    _id: userId,
    follows: { $in: [profileId] },
  }).countDocuments();

  if (count > 0) {
    await User.updateOne({ _id: userId }, { $pull: { follows: profileId } });
    await Tweet.updateMany(
      { user: profileId },
      { $pull: { followers: userId } }
    );
    await User.updateOne({ _id: profileId }, { $pull: { followers: userId } });
  } else {
    await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { follows: profileId } }
    );

    await Tweet.updateMany(
      { user: profileId },
      { $push: { followers: userId } }
    );
    z
    await User.findByIdAndUpdate(
      { _id: profileId },
      { $addToSet: { followers: userId } }
    );
  }
  
  const user = await User.findById(userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

const searchUser = asyncHandler(async (req, res, next) => {
  const keyword = req.params.keyword;

  const results = await User.find({
    $or: [
      { username: { $regex: keyword, $options: "i" } },
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ],
  });

  res.status(200).json({
    success: true,
    data: results,
  });
});

const addToBookmarks = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.body.tweetId);
  const { tweetId } = req.body;

  if (!tweet) return next(new CustomError("böyle bir tweet yok !!"), 400);

  const count = await User.find({
    _id: req.user.id,
    bookmarks: { $in: [tweetId] },
  }).countDocuments();

  if (count > 0) {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { bookmarks: tweetId } }
    );
  } else {
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { bookmarks: tweetId } }
    );
  }

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    message: "Tweet Yer imlerine başarıyla eklendi...",
    data: user,
  });
});

const getBookmarks = asyncHandler(async (req, res, next) => {
  const bookmarks = await User.findById(req.user.id)
    .select("bookmarks")
    .populate({
      path: "bookmarks",
      populate: { path: "user" },
    })
    .sort({ _id: 0 });

  res.status(200).json({
    success: true,
    data: bookmarks,
  });
});

const getTweets = asyncHandler(async (req, res, next) => {
  let tweets;

  if (req.body.user) {
    let user = await User.findOne({ username: req.body.user });
    tweets = await Tweet.find({ user: user }).populate("user");
  } else {
    tweets = await Tweet.find({ user: req.user.id }).populate("user");
  }

  let data = tweets.filter((tweet) => !tweet.parentId);

  res.status(200).json({
    success: true,
    data,
  });
});

const addNewConversation = asyncHandler(async (req, res, next) => {
  const { user, with_user } = req.body

  const count = await Conversation.find({
    $or: [
      {
        $and: [
          { user: user },
          { with_user: with_user }
        ]
      },
      {
        $and: [
          { user: with_user },
          { with_user: user }
        ]
      },

    ]

  }).countDocuments()

  let conversation;

  if (count == 0) {
    conversation = await Conversation.create({
      with_user,
      user
    })
  } else {
    return next(new CustomError('var olan bir sohbeti tekrar açamazsın !!'))
  }

  res.status(200).json({
    success: true,
    data: conversation
  })
})

const getConversations = asyncHandler(async (req, res, next) => {

  const conversations = await Conversation.find({
    $or: [
      { user: req.user.id },
      { with_user: req.user.id }
    ]
  }).populate("user with_user")

  // console.log(res.socket)
  // sendNotification()
  // res.io.emit('newConversation' , 'malik korucu')

  res.status(200).json({
    success: true,
    data: conversations
  })
})

const getMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ conversation: req.params.conversationId })

  res.status(200).json({
    success: true,
    data: messages
  })
})

const createMessage = asyncHandler(async (req, res, next) => {
  const { text, conversationId, user } = req.body
  const message = await Message.create({ text, conversation: conversationId, user })

  res.status(200).json({
    success: true,
    data: message
  })
})


const getNotifications = asyncHandler(async (req, res, next) => {

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 7

  const count = await Notification.find({ user: req.user.id }).countDocuments();
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  let notifications;
  let isFinish = false;

  if (startIndex + limit < count) {
    notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("user createdBy")
  } else {
    notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .populate("user createdBy")

    isFinish = true
  }

  res.status(200).json({
    success: true,
    notifications,
    isFinish
  })
})

module.exports = {
  getSingleUser,
  searchUser,
  followUnfollowUser,
  addToBookmarks,
  getBookmarks,
  getTweets,
  addNewConversation,
  getConversations,
  getMessages,
  createMessage,
  getNotifications
};
