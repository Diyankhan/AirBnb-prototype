const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.signupForm)
  .post(asyncWrap(userController.signup));

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    asyncWrap(userController.login)
  );

router.get("/logout", userController.logout);

module.exports = router;
