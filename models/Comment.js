var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Note constructor
  var CommentSchema = new Schema({
    title: String,
    body: String});

//Mongoose model
var Comment = mongoose.model("Comment", CommentSchema);
// Exporting the comment model
module.exports = Comment;

