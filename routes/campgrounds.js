const express = require("express");
const router = express.Router();
const Campground = require("../model/campground");
const asyncError = require("../utility/asyncError");
const { isLoggedIn, validateCampground } = require("../middleware.js");
const campground = require("../controllers/campgrounds.js");

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

router.route("/")
    .get(asyncError(campground.index)) //listing campgrounds
    .post(isLoggedIn, validateCampground, asyncError(campground.createCampground)); //create a new campground

//make a new campground
router.get("/new", isLoggedIn, campground.newForm);

router.route("/:id")
    .get(asyncError(campground.viewCampground)) //view a campground
    .put(isLoggedIn, isAuthor, validateCampground, asyncError(campground.displayUpdatedCampground)) //display updated campground
    .delete(isLoggedIn, isAuthor, asyncError(campground.deleteCampground)); //deleting a campground

//update campground
router.get("/:id/edit", isLoggedIn, isAuthor, asyncError(campground.updateCampground));

module.exports = router;