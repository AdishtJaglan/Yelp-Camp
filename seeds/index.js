const mongoose = require("mongoose");
const Campground = require("../model/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelper");
require("dotenv").config();

const dbHost = process.env.DB_HOST;

mongoose.connect(`mongodb://127.0.0.1:27017/${dbHost}`)
    .then(() => {
        console.log("Database is connected");
    })
    .catch(e => {
        console.log("Connection Failed!");
        console.log(e);
    });

const arrayIndex = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const index = Math.floor(Math.random() * 1000);

        const camp = new Campground({
            location: `${cities[index].city}, ${cities[index].state}`,
            title: `${arrayIndex(places)} ${arrayIndex(descriptors)}`
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})