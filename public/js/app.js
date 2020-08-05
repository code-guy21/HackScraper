let state = [];

$(document).ready(() => {
  function fetchArticles() {
    $.get("/articles").then((resp) => {
      resp.forEach((article) => {
        let search = state.includes(article._id);

        if (!search) {
          state.push(article._id);
          let el = $("<article>").addClass("article");
          el.append(`<p class="headline">${article.title}</p>`);
          let links = $("<div>").addClass("links");
          links.append(`<a class="link">Go</a>`);
          links.append(`<a class="link">Save</a>`);
          el.append(links);
          $("#articles").append(el);
        }
      });
    });
  }

  $("#scrape").click(() => {
    $.get("/scrape").then((resp) => {
      console.log(resp);
      fetchArticles();
    });
  });

  $("#clear").click(() => {
    $.ajax({
      method: "DELETE",
      url: "/clear",
    }).done((msg) => {
      console.log(msg);
      $("#articles").empty();
      state = [];
    });
  });

  fetchArticles();
});
