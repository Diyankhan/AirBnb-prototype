const Listing = require("../models/listing.js");
const multer = require("multer");
const { storage } = require("../cloudinary.js");
const upload = multer({ storage });
const axios = require("axios");
const ExpressError = require("../utils/expressError.js");

module.exports.index = async (req, res) => {
  let { q } = req.query;
  if (q) {
    q = q
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    let data = await Listing.find({ $or: [{ category: q }, { location: q }] });
    if (data.length) {
      res.render("./listings/home.ejs", { data });
    } else {
      req.flash("error", "No listing found");
      res.status(200).redirect("/listings");
    }
  } else {
    let data = await Listing.find();
    res.render("./listings/home.ejs", { data });
  }
};

module.exports.newForm = (req, res) => {
  res.render("./listings/post.ejs");
};

module.exports.postListing = async (req, res) => {
  const location = req.body.listing.location;

  // Use Nominatim to geocode
  const geoResponse = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "MapLibreApp/1.0",
      },
    }
  );

  const coords = geoResponse.data[0];
  req.body.listing.image = { url: req.file.path, filename: req.file.filename };

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.geoCode = {
    type: "Point",
    coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)],
  };
  await newListing.save();
  req.flash("success", "New list Added Successfully");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let listing = await Listing.findById(req.params.id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { listing });
  }
};

module.exports.editForm = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  let originalUrl = listing.image.url;

  originalUrl = originalUrl.replace("/upload", "/upload/h_300/w_300");
  if (!listing) {
    req.flash("error", "List not found");
    res.redirect("/listings");
  } else {
    res.render("./listings/edit.ejs", { listing, originalUrl });
  }
};

module.exports.editListing = async (req, res) => {
  if (req.path.file) {
    await Listing.updateOne(
      { _id: req.params.id },
      { ...req.body.listing, image: { url: req.file.path } }
    );
  } else {
    let result = await Listing.findById(req.params.id);
    let defaultUrl = result.image.url;
    await Listing.updateOne(
      { _id: req.params.id },
      { ...req.body.listing, image: { url: defaultUrl } }
    );
  }

  console.log("Updated Successfully");
  req.flash("success", "Updated Successfully");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  console.log("Deleted Successfully");
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};
