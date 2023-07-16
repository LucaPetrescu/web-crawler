const fs = require("fs");
const csv = require("csv-parser");

function readCSV() {
  return new Promise((resolve, reject) => {
    const domains = [];

    const stream = fs.createReadStream(
      "C:/Users/Luca Petrescu/Desktop/web-crawler/assets/sample-websites.csv"
    );
    stream.pipe(csv()).on("data", (row) => {
      domains.push(row.domain);
    });

    stream.on("end", () => {
      resolve(domains);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = readCSV;
