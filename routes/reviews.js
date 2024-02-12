const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncError = require("../utility/asyncError");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const review = require("../controllers/reviews.js");

//create a new review
router.post("/", isLoggedIn, validateReview, asyncError(review.newReview));

//deleting reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncError(review.deleteReview));

module.exports = router;