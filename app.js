if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utility/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./model/user.js");

const campgroundRoutes = require("./routes/campgrounds.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");

const app = express();
const dbHost = process.env.DB_HOST;
const configSessions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}

mongoose.connect(`mongodb://127.0.0.1:27017/${dbHost}`)
    .then(() => {
        console.log("Database is connected");
    })
    .catch(e => {
        console.log("Connection Failed!");
        console.log(e);
    });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(session(configSessions));
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//passsport middleware
app.use(passport.initialize());
app.use(passport.session()); //should always be below session configs

passport.use(new passportLocal(User.authenticate())); //authenticating User model
passport.serializeUser(User.serializeUser()); //how to store User
passport.deserializeUser(User.deserializeUser()); //how "unstore" User

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; //checking to see if user is logged in, should always be after serialize and deserialize user 

    next();
})

//setting up express router
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//default
app.get("/", (req, res) => {
    console.log("Working!");
    res.render("campgrounds/home");
});

//handling invalid routes
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

//basic error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;

    if (!err.message) err.message = "Oh no! Something went wrong!";

    res.status(statusCode).render("error", { head: "error", err });
});

app.listen(3000, () => {
    console.log("Listening on Port 3000");
});