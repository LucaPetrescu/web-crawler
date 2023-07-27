const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const crawler = require("./main");
require("dotenv").config();
const app = express();

const path = "/app/web-crawler/crawler/assets/sample-websites.csv";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.get("/startCrawler", async (req, res) => {
  try {
    const info = await crawler.crawl(path);
    res.send(info);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});
