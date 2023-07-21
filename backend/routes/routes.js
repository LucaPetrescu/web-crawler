const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const readCSV = require("../../helpers/csv-reader");
const Domains = require("../database/model");

const path =
  "C:/Users/Luca Petrescu/Desktop/web-crawler/assets/sample-websites-company-names.csv";

router.post("/massAddCSV", async (req, res) => {
  const data = await readCSV.readCSVMultipleColumns(path);
  try {
    for (let i = 0; i < data.length; i++) {
      const domainDocument = new Domains({
        domainName: data[i].domain,
        companyName: data[i].company_commercial_name,
        companyLegalName: data[i].company_legal_name,
        companyAllAvailableNames: data[i].company_all_available_names,
      });

      await domainDocument.save();
    }
    res.status(200).send({ response: "CSV Inserted Succesfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
