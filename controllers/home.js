const Post = require("../models/posts");
const Comment = require("../models/comment");

exports.getIndex = async (req, res, next) => {
  const posts = await Post.find();
  res.render("post/index", {
    path: "/",
    title: "Home",
    prods: posts,
  });
};

exports.postAddComment = async (req, res, next) => {
  const id = req.body.id;
  const text = req.body.comment;

  if (text) {
    comment = await Comment.create({
      comment: req.body.comment,
      postId: req.body.id,
      userName: req.user.name,
    });
  }

  res.redirect("/post/" + id);
};

exports.getPost = async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate({
    path: "comments",
    select: "comment userId userName",
  });

  console.log(post);
  res.render("post/comment", {
    comments: post,
    title: "Add Comment",
    path: "/",
  });
};

exports.getRedirect = (req, res, next) => {
  res.redirect("/");
};
