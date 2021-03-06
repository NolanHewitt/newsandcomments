const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
//scrappers
const axios = require("axios");
const cheerio = require("cheerio");
// Requiring the models
const db = require("./models");
//Port to use
let PORT = process.env.PORT || 3000;
//Express
const app = express();

// Logger
app.use(logger("dev"));
// Getting the request as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



// Connecting to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsfinder";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// Routes
// A GET route for scraping
app.get("/scrape", function(req, res) {
  // Getting the body of the site with axios
  axios.get("https://www.newsinlevels.com").then(function(response) {
    let $ = cheerio.load(response.data);
    console.log($);

    // Grab every h3 in each div
    $("div h3").each(function(i, element) {
      // Save an empty result object
     let result = {};
      // Save the text and link of each a from each h3
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article scrapped result
      db.Article.create(result)
        .then(function(dbArticle) {
          // console log the article
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    // Let us know when its done scrapping data
    res.send("Scrape complete, return to the previous page and then refresh.");
  });
});

// Get all the articles in the database
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      // send them to the client if the articles were found
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Get an article by its unique ID
app.get("/articles/:id", function(req, res) {
  // Take the paramater as the id and find the article with the matching id
  db.Article.findOne({ _id: req.params.id })
    // "Populate" all of the comments associated with the article
    .populate("comment")
    .then(function(dbArticle) {
      // If that all worked out send it to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving comments
app.post("/articles/:id", function(req, res) {
  // Createing a new comment using req.body
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // Send it to the client if its all good
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Starting the server
app.listen(PORT, function() {console.log("App running on port " + PORT + "!");});
