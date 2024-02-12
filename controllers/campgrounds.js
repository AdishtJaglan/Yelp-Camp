const Campground = require("../model/campground");

//listing campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds, head: "Campgrounds" });
}

//make a new campground
module.exports.newForm = (req, res) => {
    res.render("campgrounds/new", { head: "Create Campground" });
}

//create a new campground
module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();

    req.flash("success", "Successfully Made a New Campground");
    res.redirect(`/campground/${newCampground._id}`);
}

//view a campground
module.exports.viewCampground = async (req, res) => {
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
}

//update campground
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)

    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campground");
    }

    res.render("campgrounds/edit", { campground, head: "Update Campground" });
}

//display updated campground
module.exports.displayUpdatedCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });

    req.flash("success", "Successfully Updated Campground");
    res.redirect(`/campground/${campground._id}`);
}

//deleting a campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash("success", "Successfully Deleted Campground");
    res.redirect("/campground");
}