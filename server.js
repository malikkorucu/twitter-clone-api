const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const router = require("./router");
const cors = require("cors");
const connectDatabase = require("./helpers/db/connectDatabase");
const dotenv = require("dotenv");
const path = require("path");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const C_user = require("./controllers/C_user");
const CustomError = require("./helpers/error/CustomError");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Notification = require('./models/Notification')

// cors configure
app.use(cors());
app.options("*", cors());
app.use(express.json());

dotenv.config({
  path: "./config.env",
});

//static files
app.use(express.static(path.join(__dirname, "/public/")));

//database connection
connectDatabase();

// SOCKET İŞLEMLERİ !!!! 

const users = []
io.on('connection', socket => {
  let userId = socket.handshake.query.userId
  let tmp = users.find(user => user.userId === userId)
  if (!tmp) users.push({ userId, socket })

  //**************************Notification****************************

  socket.on('notification', async (not) => {
    const loggedInUser = users.find(user => user.userId === not.user)

    const { type, user, createdBy, about } = not

    const count = await Notification.find({
      $and: [
        { createdBy },
        { user },
        { type },
        { about }
      ]
    }).countDocuments()

    if (count === 0) {
        const notification = await Notification.create({
        type, user, createdBy, about
      })

      let data = await notification.populate({
        path: 'user createdBy about',
        populate: 'tweet'
      }).execPopulate()

      loggedInUser.socket.emit('notification', notification)
    }
  })

  socket.on('joinConversation', conversationId => {
    socket.join(conversationId)
    socket.on('outgoingMessage', msg => {
      io.to(msg.conversationId).emit('comingMessage', msg)
    })
  })
})

app.use("/api", router);
app.use(customErrorHandler);

if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/dist/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/dist/index.html"));
}

http.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});