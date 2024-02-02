const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    console.log("Working!");
    res.render("home");
});

//listing campgrounds
app.get("/campground", async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds });
});

app.get("/campground/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render("campgrounds/show", { campground });
});

app.listen(3000, () => {
    console.log("Listening on Port 3000");
});