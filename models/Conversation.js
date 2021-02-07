const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Conversation = new Schema({
  createdAt: {
    type: Date,
    default: Date,
  },
  conversationId:{
    type:mongoose.Schema.ObjectId,
    ref:"Conversation"
  },
  with_user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Conversation", Conversation);
