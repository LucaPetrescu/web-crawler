const express = require("express");
const bodyParser = require("body-parser");
const os = require("os");
const cors = require("cors");

const crawler = require("./main");
require("dotenv").config();
const app = express();

const path = "/web-crawler/crawler/assets/sample-websites.csv";
const pathFromLocal =
  "C:/Users/Luca Petrescu/Desktop/web-crawler/crawler/assets/sample-websites.csv";

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

app.get("/", (req, res) => {
  console.log(os.hostname());
  let response = {
    msg: "hello world",
    hostname: os.hostname().toString(),
  };
  res.send(response);
});
