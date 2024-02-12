const express = require("express");
const router = express.Router();
const asyncError = require("../utility/asyncError");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const user = require("../controllers/users");

router.route("/register")
    .get(user.registerUser) //display form to register new user
    .post(asyncError(user.newUser)); //registering new user

router.route("/login")
    .get(user.loginPage) //login page
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), user.loginUser); //logging in

//logout route
router.get("/logout", user.logoutUser);

module.exports = router;