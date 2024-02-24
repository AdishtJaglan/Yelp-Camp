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

    for (let i = 0; i < 300; i++) {
        const index = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;

        const camp = new Campground({
            author: "65c92570bccd3905fc5a3d7d",
            location: `${cities[index].city}, ${cities[index].state}`,
            title: `${arrayIndex(places)} ${arrayIndex(descriptors)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit aspernatur libero sequi est magnam sed. Porro quos quod dolor aut, incidunt, sed at fugit similique reiciendis doloremque, laudantium facilis ullam!",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[index].longitude,
                    cities[index].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dv3pty7wm/image/upload/v1708703762/YelpCamp/bqeejcrlf0unodyblkiq.jpg',
                    filename: 'YelpCamp/pert2i9ugg4sqckfdxu8',
                },
                {
                    url: 'https://res.cloudinary.com/dv3pty7wm/image/upload/v1708706136/YelpCamp/sunqhtua223ioj1mk2cc.jpg',
                    filename: 'YelpCamp/zr7ccitvd6i1cehrnhg1',
                }
            ],
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})