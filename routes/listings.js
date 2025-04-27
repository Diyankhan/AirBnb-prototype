const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const multer = require("multer");
const { storage } = require("../cloudinary.js");
const upload = multer({ storage });

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const {
  isLoggedIn,
  preventUnauthorized,
  validateSchema,
} = require("../middleware.js");

const listingControllers = require("../controllers/listings.js");

router
  .route("/")
  .get(asyncWrap(listingControllers.index))
  .post(
    [isLoggedIn, upload.single("listing[image]"), validateSchema],
    listingControllers.postListing
  );

//New form
router.get("/new", isLoggedIn, listingControllers.newForm);

router
  .route("/:id")
  .get(asyncWrap(listingControllers.showListing))
  .put(
    [
      isLoggedIn,
      upload.single("listing[image]"),
      validateSchema,
      preventUnauthorized,
    ],
    asyncWrap(listingControllers.editListing)
  )
  .delete(
    [isLoggedIn, preventUnauthorized],
    asyncWrap(listingControllers.deleteListing)
  );

//Edit form
router.get(
  "/:id/edit",
  [isLoggedIn, preventUnauthorized],
  asyncWrap(listingControllers.editForm)
);



module.exports = router;
