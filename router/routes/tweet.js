const router = require("express").Router();
const {
  addTweet,
  getTweets,
  enjoyTweet,
  getSingleTweet,
  getComments,
  getTweetsOfUser,
} = require("../../controllers/C_tweet");

router.post("/addTweet", addTweet);
router.get("/getTweets/:id", getTweets);
router.post("/enjoyTweet", enjoyTweet);
router.get("/:id", getSingleTweet);
router.get("/comments/:tweetId", getComments);

module.exports = router;
