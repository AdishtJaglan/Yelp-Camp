const User = require("../model/user");

//display form to register new user
module.exports.registerUser = (req, res) => {
    res.render("users/register", { head: "Register" });
}

//registering new user
module.exports.newUser = async (req, res) => {
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
}

//login page
module.exports.loginPage = (req, res) => {
    res.render("users/login", { head: "login" });
}

//logging in
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Logged In!");
    const redirectUrl = res.locals.returnTo || "/campground";
    delete req.session.returnTo;

    res.redirect(redirectUrl);
}

//logout route
module.exports.logoutUser = (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Succesfully Logged You Out!");

        res.redirect("/campground");
    });
}