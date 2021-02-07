const router = require('express').Router()
const auth =  require('./routes/auth')
const tweet = require('./routes/tweet')
const user = require('./routes/user')
const { getAccessToRoute } = require("../middlewares/errors/authorization");

router.use('/auth' , auth)
router.use('/tweet', getAccessToRoute , tweet)
router.use('/user' , getAccessToRoute, user)

module.exports = router