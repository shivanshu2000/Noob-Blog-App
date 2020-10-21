const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const MonngoDBStore = require("connect-mongodb-session")(session);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const app = express();

app.use(express.json());
const store = new MonngoDBStore({
  uri: DB,
  collection: "sessions",
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/img")));

app.set("view engine", "ejs");
app.set("views", "views");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

const shopRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(shopRoutes);
app.use(authRoutes);
app.use(adminRoutes);

const port = process.env.PORT || 8085;

mongoose
  .connect(DB)
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
