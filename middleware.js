const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingData, reviewData } = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.session.redirectPath = req.originalUrl;
        res.redirect("/login");
    }
}

module.exports.validateSchema = (req, res, next) => {
    let { error } = listingData.validate(req.body.listing);
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      return next(new expressError(400, msg));
    } else {
      next();
    }
  };

module.exports.saveRedirect = (req, res, next) => {
    if(req.session.redirectPath){   
        res.locals.redirectionPath = req.session.redirectPath;
    }
    next();
}

module.exports.preventUnauthorized = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    if (listing.owner[0]._id.equals(res.locals.currUser._id)) {
        next();
    }
    else{
        req.flash("error", "Unauthorized Access");
        return res.redirect("/listings");
    }
}

//valdiation middleware for reviews
module.exports.validateReviews = (req, res, next) => {
    let result = reviewData.validate(req.body.review);
    if(result.error) {
        let errMsg = result.error.details.map((el) => el.message).join(",");
        return next(new expressError(500, errMsg))
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(review.author._id.equals(req.user._id)){
        next();
    }
    else{
        req.flash("error", "You aren't the owner of the Review so you can't delete this review.");
        res.redirect(`/listings/${id}`);
    }
}
