const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

module.exports = (app) => {
  app.get("/scrape", (req, res) => {
    axios.get("https://hackernoon.com/").then((resp) => {
      let $ = cheerio.load(resp.data);

      $("article h2").each(function (i, element) {
        let result = {};

        result.title = $(this).children("a").text();
        result.link = `https://hackernoon.com/${$(this)
          .children("a")
          .attr("href")}`;

        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          });
      });

      res.send("Scrape Complete");
    });
  });

  app.get("/articles", (req, res) => {
    db.Article.find({})
      .then((resp) => {
        res.json(resp);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.delete("/clear", (req, res) => {
    db.Article.remove({})
      .then((resp) => {
        res.json(resp);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.put("/save/:id", (req, res) => {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { saved: true },
      { new: true }
    )
      .then((resp) => {
        res.json(resp);
      })
      .catch((err) => {
        res.json(err);
      });
  });
};
