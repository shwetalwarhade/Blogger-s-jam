// Requiring all the packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connection to MondoDB Atlas Database
mongoose.connect(' mongodb://127.0.0.1:27017/store', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Creating the Schema
const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Creating the Model with New Collection
const Post = mongoose.model("Post", postsSchema);

// Adding Routes to application
app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      finalPosts: posts,
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      customTitle: post.title,
      customContent: post.content,
    });
  });
});

// Declaring the Server's Port Number
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
