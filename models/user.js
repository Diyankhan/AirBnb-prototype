const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

let User = new model("User", userSchema);

module.exports = User;
