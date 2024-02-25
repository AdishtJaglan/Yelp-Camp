
# YelpCamp

A website on which you can host and view campgrounds across various locations. You can host your own campgrounds and view the campground of other people. You can view the reviews of campgrounds which have been posted by other users. 
All campgrounds hosted will automatically be geocoded and be visible on a clustermap on the index page. 


## Features

- Ability to create, view, update and delete your campground.
- Can post reviews on each campground which will be associated to a user.
- Each campgrounds' entered location is automatically geocoded into a cluster map. 
- Each campground and review is associated with a user.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_ATLAS` - your own mongo atlas connection string

`MAPBOX_TOKEN` - mapbox token for mapbox.com

`CLOUDINARY_SECRET` - cloudinary secret from cloudinary.com

`CLOUDINARY_KEY` - cloudinary api key from cloudinary.com

`CLOUDINARY_CLOUD_NAME` - your cloudinary cloud name 

`SESSION_SECRET` - session secret

`DB_HOST` - local mongoDB database name incase connection      to atlas fails


## Run Locally

Clone the project

```bash
  git clone https://github.com/AdishtJaglan/Yelp-Camp.git
```

Go to the project directory

```bash
  cd Yelp-Camp
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

