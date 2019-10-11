// Get all the articles in json format
$.getJSON("/articles", function(data) {
  // For Loop
  for (let i = 0; i < data.length; i++) {
    // Display for each item
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

// On click for all P tags on my page
$(document).on("click", "p", function() {
  $("#notes").empty();
  let thisId = $(this).attr("data-id");
  // Ajax call for the article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId})
    // Add the note, appending the create/or-update note box
    .then(function(data) {
      console.log(data);
      // Articles title
      $("#notes").append("<h2>" + data.title + "</h2>");
      // Input to title the note
      $("#notes").append("<input id='titleinput' name='title' >");
      // TextArea for the body of the note
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // The notes save button
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      // If there is already a note for the article...
      if (data.note) {
        // Put the notes title and body text into the box
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});
// Function for when the save note button is clicked on
$(document).on("click", "#savenote", function() {
  // Get the articles ID
  let thisId = $(this).attr("data-id");
  // Ajax post for the note based on what is in the input fields.
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Values taked from the title and body input fields
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    // Promise function
    .then(function(data) {
      console.log(data);
      // Empty the note box
      $("#notes").empty();});
  // Remove the values from the input fields
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
