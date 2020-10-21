const express = require("express");
const postController = require("../controllers/home");

const router = express.Router();

router.get("/", postController.getIndex);
router.post("/add-comment", postController.postAddComment);
router.get("/post/:postId", postController.getPost);
// router.get('/add-comment',postController.getRedirect)

module.exports = router;
