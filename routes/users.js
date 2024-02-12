const express = require("express");
const router = express.Router();
const User = require("../model/user");
const asyncError = require("../utility/asyncError");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

//display form to register new user
router.get("/register", (req, res) => {
    res.render("users/register", { head: "Register" });
});

//registering new user
router.post("/register", asyncError(async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password); // register() automatically saves user to db

        //logging user in after they register
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to YelpCamp!");
            res.redirect("/campground");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}));

//login page
router.get("/login", (req, res) => {
    res.render("users/login", { head: "login" });
});

//logging in
router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Logged In!");
    const redirectUrl = res.locals.returnTo || "/campground";
    delete req.session.returnTo;

    res.redirect(redirectUrl);
});

//logout route
router.get("/logout", (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Succesfully Logged You Out!");

        res.redirect("/campground");
    });
});

module.exports = router;