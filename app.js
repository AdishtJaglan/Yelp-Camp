const express = require("express");
const path = require("path");
require("dotenv").config();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const asyncError = require("./utility/asyncError");
const ExpressError = require("./utility/expressError");
const Campground = require("./model/campground");

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

app.get("/", (req, res) => {
    console.log("Working!");
    res.render("home");
});

//listing campgrounds
app.get("/campground", asyncError(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds, head: "Campgrounds" });
}));

//make a new campground
app.get("/campground/new", (req, res) => {
    res.render("campgrounds/new", { head: "Create Campground" });
});

//create a new product
app.post("/campground", asyncError(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const newCampground = new Campground(req.body);
    await newCampground.save();

    res.redirect(`/campground/${newCampground._id}`);
}));

//view a campground
app.get("/campground/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render("campgrounds/show", { campground, head: "View Campground" });
}));

//update campground
app.get("/campground/:id/edit", asyncError(async (req, res) => {
    const { id } = req.params;
    const findCampground = await Campground.findById(id);

    res.render("campgrounds/edit", { findCampground, head: "Update Campground" });
}));

//display updated campground
app.put("/campground/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });

    res.redirect(`/campground/${campground._id}`);
}));

//deleting a campground
app.delete("/campground/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect("/campground");
}));

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