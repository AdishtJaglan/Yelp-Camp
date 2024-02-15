const express = require("express");
const router = express.Router();
const asyncError = require("../utility/asyncError");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");
const campground = require("../controllers/campgrounds.js");
const multer = require("multer");
const storage = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(asyncError(campground.index)) //listing campgrounds
    .post(isLoggedIn, upload.single("image"), validateCampground, asyncError(campground.createCampground)); //create a new campground

//make a new campground
router.get("/new", isLoggedIn, campground.newForm);

router.route("/:id")
    .get(asyncError(campground.viewCampground)) //view a campground
    .put(isLoggedIn, isAuthor, validateCampground, asyncError(campground.displayUpdatedCampground)) //display updated campground
    .delete(isLoggedIn, isAuthor, asyncError(campground.deleteCampground)); //deleting a campground

//update campground
router.get("/:id/edit", isLoggedIn, isAuthor, asyncError(campground.updateCampground));

module.exports = router;