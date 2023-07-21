const fs = require("fs");
const csv = require("csv-parser");

function readCSVSingleColumn(path) {
  return new Promise((resolve, reject) => {
    const domains = [];

    const stream = fs.createReadStream(path);
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

function readCSVMultipleColumns(path) {
  return new Promise((resolve, reject) => {
    const data = [];

    const stream = fs.createReadStream(path);
    stream
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = { readCSVMultipleColumns, readCSVSingleColumn };
