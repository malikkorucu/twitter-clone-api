const router = require('express').Router()
const {signUpUser, signInUser , test} =  require('../../controllers/C_auth');
const { getAccessToRoute } = require('../../middlewares/errors/authorization');

router.post("/register", signUpUser);
router.post("/login", signInUser);
router.get("/test", getAccessToRoute, test);

module.exports =  router