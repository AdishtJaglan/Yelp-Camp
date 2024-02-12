const express = require("express");
const router = express.Router();
const Campground = require("../model/campground");
const asyncError = require("../utility/asyncError");
const { isLoggedIn, validateCampground } = require("../middleware.js");

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

//listing campgrounds
router.get("/", asyncError(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds, head: "Campgrounds" });
}));

//make a new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new", { head: "Create Campground" });
});

//create a new campground
router.post("/", isLoggedIn, validateCampground, asyncError(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();

    req.flash("success", "Successfully Made a New Campground");
    res.redirect(`/campground/${newCampground._id}`);
}));

//view a campground
router.get("/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("author");

    if (!campground) {
        req.flash("error", "Cannot Find That Campground");
        return res.redirect("/campground");
    }

    res.render("campgrounds/show", { campground, head: "View Campground" });
}));

//update campground
router.get("/:id/edit", isLoggedIn, isAuthor, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)

    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campground");
    }

    res.render("campgrounds/edit", { campground, head: "Update Campground" });
}));

//display updated campground
router.put("/:id", isLoggedIn, isAuthor, validateCampground, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });

    req.flash("success", "Successfully Updated Campground");
    res.redirect(`/campground/${campground._id}`);
}));

//deleting a campground
router.delete("/:id", isLoggedIn, isAuthor, asyncError(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfully Deleted Campground");
    res.redirect("/campground");
}));

module.exports = router;