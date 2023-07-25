const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");

router.post("/massAddCSV", async (req, res, next) => {
  try {
    await controllers.massAdd(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/executeCrawler", async());

router.post("/mergeDataset", async (req, res, next) => {});

router.use((error, req, res, next) => {
  console.error(`Error: ${error.message}`);
  res.status(500).send(`Error: ${error.message}`);
});

module.exports = router;
