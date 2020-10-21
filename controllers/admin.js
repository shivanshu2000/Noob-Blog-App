const Post = require("../models/posts");
const Comment = require("../models/comment");
const multer = require("multer");
const sharp = require("sharp");
const { json } = require("body-parser");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("image");

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);

  next();
};

exports.getAddPost = (req, res, next) => {
  res.render("admin/add-post", {
    path: "/add-post",
    title: "Add Post",
  });
};

exports.postAddPost = (req, res, next) => {
  if (!req.body.title || !req.body.caption || !req.file) {
    return res.redirect("/add-posts");
  }
  const title = req.body.title;
  let imageUrl = req.file;
  const caption = req.body.caption;
  console.log(req.body);
  imageUrl = imageUrl.filename;
  console.log(imageUrl);
  // console.log(title);
  // res.redirect('/')
  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: caption,
    userId: req.user,
    userName: req.user.name,
  });

  post
    .save()
    .then((result) => {
      res.redirect("/my-posts");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPost = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user });
    res.render("admin/posts", {
      path: "/posts",
      title: "My Posts",
      prods: posts,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.goToEditPage = (req, res, next) => {
  const id = req.params.postId;
  //   console.log(id);

  Post.findById(id).then((post) => {
    res.render("admin/edit-post", {
      post: post,
      title: "Edit post",
      path: "",
    });
  });
};

exports.postEdit = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.caption || !req.file) {
      return res.redirect("/edit-posts");
    }
    const body = req.body;
    let image = req.file;
    const caption = body.caption;
    const title = body.title;
    if (image) {
      image = image.filename;
      const post = await Post.findById(req.params.id);
      console.log(post);
      post.title = title;
      post.imageUrl = image;
      post.caption = caption;
      console.log(post);

      await post.save();
      res.redirect("/my-posts");
      return;
    }

    const post = await Post.findById(req.params.id);
    console.log(post);
    post.title = title;
    post.caption = caption;

    await post.save();

    console.log(post);

    res.redirect("/my-posts");
  } catch (error) {
    console.log(error);
  }
};

exports.deletePost = async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.postId);
  res.redirect("/my-posts");
};
