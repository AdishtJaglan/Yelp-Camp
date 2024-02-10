const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncError = require("../utility/asyncError");
const ExpressError = require("../utility/expressError");
const Campground = require("../model/campground");
const Reviews = require("../model/review.js");
const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//create a new review
router.post("/", validateReview, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Reviews(req.body.review);

    campground.reviews.push(review);

    await campground.save();
    await review.save();

    res.redirect(`/campground/${campground._id}`);
}));

//deleting reviews
router.delete("/:reviewId", asyncError(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/campground/${id}`);
}));

module.exports = router;