const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema({
    createdAt: {
        type: Date,
        default: Date
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["enjoy", "retweet", "admin", "message", "follow", "comment"]
    },
    about: {
        topic: {
            type: String,
            enum: ["tweet","user"],
            required: true
        },
        tweet: {
            type: mongoose.Schema.ObjectId,
            ref: "Tweet"
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
    }
});

module.exports = mongoose.model("Notification", Notification);
