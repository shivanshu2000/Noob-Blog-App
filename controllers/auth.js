const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    title: "Login",
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/sign-up",
    title: "My Posts",
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  //   const user = await User.find({ email: email });
  //     console.log(err)
  //     return res.redirect("/signup");
  //   }

  if (!req.body.email || !req.body.name || !req.body.password) {
    return res.redirect("/signup");
  }

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.redirect("/login");
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!req.body.email || !req.body.password) {
    res.redirect("/login");
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
