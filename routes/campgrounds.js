const express = require("express");
const router = express.Router();
const Campground = require("../model/campground");
const asyncError = require("../utility/asyncError");
const ExpressError = require("../utility/expressError");
const { campgroundSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//listing campgrounds
router.get("/", asyncError(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds, head: "Campgrounds" });
}));

//make a new campground
router.get("/new", (req, res) => {
    res.render("campgrounds/new", { head: "Create Campground" });
});

//create a new product
router.post("/", validateCampground, asyncError(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();

    req.flash("success", "Successfully Made a New Campground");
    res.redirect(`/campground/${newCampground._id}`);
}));

//view a campground
router.get("/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");

    if (!campground) {
        req.flash("error", "Cannot Find That Campground");
        return res.redirect("/campground");
    }

    res.render("campgrounds/show", { campground, head: "View Campground" });
}));

//update campground
router.get("/:id/edit", asyncError(async (req, res) => {
    const { id } = req.params;
    const findCampground = await Campground.findById(id);

    if (!findCampground) {
        req.flash("error", "Cannot Find That Campground");
        return res.redirect("/campground");
    }

    res.render("campgrounds/edit", { findCampground, head: "Update Campground" });
}));

//display updated campground
router.put("/:id", validateCampground, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });

    req.flash("success", "Successfully Updated Campground");
    res.redirect(`/campground/${campground._id}`);
}));

//deleting a campground
router.delete("/:id", asyncError(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfully Deleted Campground");
    res.redirect("/campground");
}));

module.exports = router;