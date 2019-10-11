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
  $("#comments").empty();
  let thisId = $(this).attr("data-id");
  // Ajax call for the article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId})
    // Add the comment, appending the create/or-update comment box
    .then(function(data) {
      console.log(data);
      // Articles title
      $("#comments").append("<h2>" + data.title + "</h2>");
      // Input to title the comment
      $("#comments").append("<input id='titleinput' name='title' >");
      // TextArea for the body of the comment
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // The comments save button
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
      // If there is already a comment for the article...
      if (data.comment) {
        // Put the comments title and body text into the box
        $("#titleinput").val(data.comment.title);
        $("#bodyinput").val(data.comment.body);
      }
    });
});
// Function for when the save comment button is clicked on
$(document).on("click", "#savecomment", function() {
  // Get the articles ID
  let thisId = $(this).attr("data-id");
  // Ajax post for the comment based on what is in the input fields.
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
      // Empty the comment box
      $("#comments").empty();});
  // Remove the values from the input fields
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
