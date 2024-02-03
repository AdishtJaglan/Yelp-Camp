const express = require("express");
const path = require("path");
require("dotenv").config();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
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
app.get("/campground", async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds, head: "Campgrounds" });
});

//make a new campground
app.get("/campground/new", (req, res) => {
    res.render("campgrounds/new", { head: "Create Campground" });
});

//create a new product
app.post("/campground", async (req, res) => {
    const newCampground = new Campground(req.body);
    await newCampground.save();

    res.redirect(`/campground/${newCampground._id}`);
});

//view a campground
app.get("/campground/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render("campgrounds/show", { campground, head: "View Campground" });
});

//update campground
app.get("/campground/:id/edit", async (req, res) => {
    const { id } = req.params;
    const findCampground = await Campground.findById(id);

    res.render("campgrounds/edit", { findCampground, head: "Update Campground" });
});

//display updated campground
app.put("/campground/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });

    res.redirect(`/campground/${campground._id}`);
});

//deleting a campground
app.delete("/campground/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect("/campground");
});

app.listen(3000, () => {
    console.log("Listening on Port 3000");
});