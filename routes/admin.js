const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

router.get("/add-posts", adminController.getAddPost);
router.get("/my-posts", adminController.getPost);
router.post(
  "/add-posts",
  adminController.uploadUserPhoto,
  adminController.resizeUserPhoto,
  adminController.postAddPost
);

router.post(
  "/postEdit/:id",
  adminController.uploadUserPhoto,
  adminController.resizeUserPhoto,
  adminController.postEdit
);

router.get("/edit-post/:postId", adminController.goToEditPage);
router.post("/delete-post/:postId", adminController.deletePost);
module.exports = router;
