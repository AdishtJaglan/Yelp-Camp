const express = require("express");
const path = require("path");
require("dotenv").config();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utility/expressError");
const session = require("express-session");
const flash = require("connect-flash");

const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");

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
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    next();
})

//setting up express router
app.use("/campground", campgrounds);
app.use("/campground/:id/reviews", reviews);

//default
app.get("/", (req, res) => {
    console.log("Working!");
    res.send("Yelp-Camp");
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