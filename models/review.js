const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

let reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

let Review = new model("Review", reviewSchema);

module.exports = Review;
