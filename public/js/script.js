$(document).ready(() => {
  $("#scrape").click(() => {
    $.get("/scrape").then((resp) => {
      console.log(resp);
    });
  });

  $("#clear").click(() => {
    console.log("clear");
  });
});
