const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    index:true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    index:true,
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "lütfen geçerli bir email adresi giriniz",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    minlength: [6, "Şifre en az 6 karakter olmalıdır"],
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date,
  },
  profile_image: {
    type: String,
    default: "default.jpg",
  },
  background_image: {
    type: String,
    default: "default-bg.jpg",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  follows: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  tweets: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tweet",
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tweet",
    },
  ],
  lists: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "List",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
  ],
  notifications: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Notification",
    },
  ],
  birthDate: {
    type: Date,
    required: true,
  },
});

// User.createIndex({username:1, email:1} , {unique:true})
//Generating JWT
User.methods.generateJwtToken = function () {
  const { SECRET_KEY, EXPIRES_IN } = process.env;

  let payload = {
    id: this._id,
    name: this.name,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRES_IN,
  });

  return token;
};

//Password hashing
User.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.password, salt);

  this.password = hash;
  next();
});

module.exports = mongoose.model("User", User);
