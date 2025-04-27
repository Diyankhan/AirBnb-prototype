const express = require('express');
const router = express.Router({mergeParams : true});
const asyncWrap = require("../utils/asyncWrap.js");
const { validateReviews, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");


//Post review
router.post("/", [isLoggedIn, validateReviews] ,asyncWrap(reviewControllers.postReview));

//Delete Review
router.delete("/:reviewId", [isLoggedIn, isAuthor], asyncWrap(reviewControllers.deleteReview))

module.exports = router;