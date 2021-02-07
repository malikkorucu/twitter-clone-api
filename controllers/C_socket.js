const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 5000;

const users = []

const initSocket = () => {
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

    http.listen(PORT, () => {
        console.log(`server started on ${PORT}`);
    });
}



module.exports = initSocket