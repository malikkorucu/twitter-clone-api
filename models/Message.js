const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
  createdAt: {
    type: Date,
    default: Date,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required:true,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    required:true,
    ref: "Conversation",
  },
  image: {
    type: String,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Message", Message);
