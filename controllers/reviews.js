const Review = require("../models/review.js");
const Listing = require('../models/listing.js');

module.exports.postReview = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  let reviewData = new Review(req.body.review);
  reviewData.author = req.user._id;
  listing.review.push(reviewData);
  await reviewData.save();
  await listing.save();
  req.flash( "success", "Review added Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  // await Listing.findOneAndDelete({reviews : reviewId})
  let result = await Listing.findByIdAndUpdate(id, { $pull: { review : reviewId } });
  console.log(result);
  
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted Successfully");
  res.redirect(`/listings/${id}`);
};
