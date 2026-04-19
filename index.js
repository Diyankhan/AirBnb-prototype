const express = require("express");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ================= DATABASE =================
async function main() {
  await mongoose.connect(process.env.DB_URL);
}

// ================= PORT =================
const PORT = process.env.PORT || 3000;

// ================= VIEW ENGINE =================
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// ================= MIDDLEWARE =================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ================= SESSION STORE =================
const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionConfig = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL VARIABLES =================
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ================= ROUTES =================
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).redirect("/listings");
});

// ================= START SERVER =================
main()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed:", err);
  });
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);

//handle all the errors
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  console.log(err);

  res.status(status).render("./listings/error.ejs", { message });
});

app.use("/listings/:id/reviews", (req, res) => {
  res.redirect(`/listings/${req.params.id}`);
});

// Handle unknown/undefined paths
app.use("/listings", (req, res, next) => {
  res.render("./listings/notFound.ejs");
});

// After all routes & static files
app.use((req, res) => {
  res.status(404).redirect("/listings");
});
