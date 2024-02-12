const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncError = require("../utility/asyncError");
const Campground = require("../model/campground");
const Review = require("../model/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//create a new review
router.post("/", isLoggedIn, validateReview, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;

    campground.reviews.push(review);

    await campground.save();
    await review.save();

    req.flash("success", "Created New Review");
    res.redirect(`/campground/${campground._id}`);
}));

//deleting reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncError(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully Deleted Review");
    res.redirect(`/campground/${id}`);
}));

module.exports = router;