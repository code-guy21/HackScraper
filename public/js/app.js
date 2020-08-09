let state = {};

$(document).ready(() => {
  function fetchArticles() {
    return $.get("/api/articles").then((resp) => {
      resp.forEach((article) => {
        if (!state[article._id]) {
          state[article._id] = article;
        }
      });
    });
  }

  function loadAll() {
    Object.values(state).forEach((article) => {
      if (!article.saved) {
        render(article, false);
      }
    });
  }

  function loadSaved() {
    Object.values(state).forEach((article) => {
      if (article.saved) {
        render(article, true);
      }
    });
  }

  function render(article, saved) {
    let el = $("<article>").addClass("article");
    el.append(`<p class="headline">${article.title}</p>`);
    el.append(`<p class="summary">${article.body}</p>`);

    let links = $("<div>").addClass("links");

    links.append(
      `<a href="${article.link}" class="link"><i class="far fa-external-link"></i></a>`
    );
    if (!saved) {
      links.append(
        `<a class="link save" data-id="${article._id}"><i class="far fa-save"></i></a>`
      );
    } else {
      links.append(
        `<a class="link note" data-id="${article._id}"><i class="far fa-edit"></i></a>`
      );
    }

    el.append(links);

    $("#articles").append(el);
  }

  $("#scrape").click(() => {
    $.get("/scrape").then((resp) => {
      console.log(resp);
      fetchArticles().then(() => {
        if ($("#saved").attr("state") === "all") {
          loadAll();
        }
      });
    });
  });

  $("#clear").click(() => {
    $.ajax({
      method: "DELETE",
      url: "/api/clear",
    }).done((msg) => {
      console.log(msg);
      $("#articles").empty();
      state = [];
    });
  });

  $("#saved").click(function () {
    $("#articles").empty();
    if ($(this).attr("state") === "all") {
      $("#saved").text("articles");
      $("#saved").attr("state", "saved");
      loadSaved();
    } else {
      $("#saved").text("saved");
      $("#saved").attr("state", "all");
      loadAll();
    }
  });

  $(document).on("click", ".save", function () {
    let id = $(this).attr("data-id");

    $.ajax({
      method: "PUT",
      url: "/api/article/save/" + id,
    }).done((resp) => {
      state[id] = { ...resp };
      $(this).closest(".article").remove();
    });
  });

  fetchArticles().then(() => loadAll());
});
