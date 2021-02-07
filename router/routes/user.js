const router = require("express").Router();
const {
  getSingleUser,
  followUnfollowUser,
  searchUser,
  addToBookmarks,
  getBookmarks,
  getTweets,
  addNewConversation,
  getConversations,
  getMessages,
  createMessage,
  getNotifications
} = require("../../controllers/C_user");

router.get("/getSingleUser/:username", getSingleUser);
router.post("/follow/:id", followUnfollowUser);
router.get("/search/:keyword", searchUser);
router.post("/bookmarks/add", addToBookmarks);
router.get("/bookmarks", getBookmarks);
router.post("/tweets", getTweets);
router.post("/newConversation", addNewConversation);
router.get('/conversations', getConversations)
router.get('/messages/:conversationId', getMessages)
router.post('/message/new', createMessage)
router.get('/notifications', getNotifications)

module.exports = router;
