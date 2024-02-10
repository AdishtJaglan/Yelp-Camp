const express = require("express");
const path = require("path");
require("dotenv").config();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utility/expressError");

const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");

const app = express();
const dbHost = process.env.DB_HOST;

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/campground", campgrounds);
app.use("/campground/:id/reviews", reviews);

app.get("/", (req, res) => {
    console.log("Working!");
    res.render("home");
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