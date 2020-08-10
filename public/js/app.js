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
        renderArticles(article, false);
      }
    });
  }

  function loadSaved() {
    Object.values(state).forEach((article) => {
      if (article.saved) {
        renderArticles(article, true);
      }
    });
  }

  function renderArticles(article, saved) {
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
        `<a class="link addNote" data-id="${article._id}"><i class="far fa-edit"></i></a>`
      );
    }

    el.append(links);

    $("#articles").append(el);
  }

  function renderNotes(notes) {
    notes.forEach((note) => {
      let noteEl = $("<div>").addClass("card note").attr("data-id", note._id);
      let body = $("<div>").addClass("card-body");
      body.append(
        `<button class="close close-note"><span aria-hidden="true">&times;</span></button>`
      );
      body.append(`<h5 class="card-title">${note.title}</h5>`);
      body.append(`<p class="card-text">${note.body}</p>`);

      noteEl.append(body);
      $("#notes").append(noteEl);
    });
    $("#myModal").modal("show");
  }

  $("#scrape").click(() => {
    console.log("scraping");
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

  $(document).on("click", ".addNote", function () {
    let id = $(this).attr("data-id");
    $("#myModal").attr("data-id", id);

    $.get(`/api/article/notes/${id}`).then((resp) => {
      $("#notes").empty();
      renderNotes(resp);
    });
  });

  $(document).on("click", ".close-note", function () {
    let articleId = $("#myModal").attr("data-id");
    let noteId = $(this).closest(".note").attr("data-id");

    $.ajax({
      method: "DELETE",
      url: `/api/note/delete/${noteId}/${articleId}`,
    }).then((resp) => {
      $(`.note[data-id="${noteId}"]`).remove();
    });
  });

  $("#addNote").click(() => {
    let title = $("#noteTitle").val();
    let body = $("#noteMessage").val();
    let id = $("#myModal").attr("data-id");

    $.ajax({
      method: "POST",
      url: `/api/note/${id}`,
      data: {
        title,
        body,
      },
    }).then((resp) => {
      renderNotes([resp]);
    });
  });

  fetchArticles().then(() => loadAll());
});
