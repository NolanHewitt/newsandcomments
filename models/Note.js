var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Note constructor
  var NoteSchema = new Schema({
    title: String,
    body: String});

//Mongoose model
var Note = mongoose.model("Note", NoteSchema);
// Exporting the note model
module.exports = Note;
