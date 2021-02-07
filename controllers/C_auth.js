const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { comparePasswords, sendTokenToClient } = require("../helpers/auth");
const CustomError = require("../helpers/error/CustomError");

const signUpUser = asyncHandler(async (req, res, next) => {
  const { username, password, email, name, birthDate } = req.body;
  
  const user = await User.create({
    username,
    password,
    name,
    email,
    name,
    birthDate
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

const signInUser = asyncHandler(async (req, res, next) => {
  
  const { usernameOrEmail, password } = req.body;

  console.log(req.body)

  const username = usernameOrEmail.split("").includes("@")
    ? null
    : usernameOrEmail;
  const email = usernameOrEmail;

  let user;

  if (username) {
    const userDb = await User.findOne({ username }).select("+password");
    user = userDb;
  } else {
    const userDb = await User.findOne({ email }).select("+password");
    user = userDb;
  }

  if (!comparePasswords(password, user.password)) {
    return next(new CustomError("parolalar eşleşmiyor", 400));
  }

  res.status(200).json({
    success: true,
    message: `Hoşgeldin ${user.name}`,
    user,
    authentication: sendTokenToClient(user),
  });
  
});


const test = (req, res, next) => {
  res.json({
    success: true,
    message:'biravo'
  })
}

module.exports = {
  signUpUser,
  signInUser,
  test
};
