var mongoose = require("mongoose");
let Schema = mongoose.Schema;

//Article constructor
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  //id for note with reference to note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Mongoose article model
let Article = mongoose.model("Article", ArticleSchema);
// Exporting the article model
module.exports = Article;
