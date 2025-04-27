const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
  res.render("./users/signup");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = await req.body;
    let userData = new User({
      email: email,
      username: username,
    });
    let registeredUser = await User.register(userData, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Registered Successfully");
        res.redirect("/listings");
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = async (req, res) => {
  if (res.locals.redirectionPath) {
    req.flash("success", "Welcome Back");
    res.redirect(res.locals.redirectionPath);
  } else {
    req.flash("success", "Welcome Back");
    res.redirect("/listings");
  }
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      throw new err();
    } else {
      req.flash("success", "You logged out successfully.");
      res.redirect("/listings");
    }
  });
};
