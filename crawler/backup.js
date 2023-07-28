//main.js

// const cheerio = require("cheerio");
// const axios = require("axios");
// const readCSV = require("./helpers/csv-reader");
// const crawler = require("./logic/crawler");

// const visitedUrls = new Set();
// const domainData = [];

// async function start() {
//   const domains = await readCSV();
//   for (let i = 0; i < 10; i++) {
//     const baseUrl = `https://${domains[i]}`;
//     crawl(baseUrl);
//   }
// }

// async function crawl(baseUrl) {
//   const phoneNumbers = [];
//   if (visitedUrls.has(baseUrl)) {
//     return;
//   }

//   visitedUrls.add(baseUrl);

//   try {
//     const response = await axios.get(baseUrl);
//     const html = response.data;
//     const $ = cheerio.load(html);
//     const homePagePhoneNumbers = await crawler.crawlHomePage($);
//     phoneNumbers.push(...homePagePhoneNumbers);

//     if (baseUrl.includes("/contact")) {
//       const contactPagePhoneNumbers = await crawler.crawlContactPage($);
//       phoneNumbers.push(...contactPagePhoneNumbers); // Display phone numbers after contacting
//     } else {
//       $("a").each((index, element) => {
//         const href = $(element).attr("href");
//         if (href && href.startsWith("/")) {
//           const nextPageUrl = new URL(href, baseUrl).href;
//           crawl(nextPageUrl);
//         }
//       });
//     }
//     // console.log("aici", domainData);
//   } catch (error) {
//     if (error.errno === -3008) {
//       console.log(`Error: ${baseUrl} not available`);
//     } else {
//       console.log(`Error for ${baseUrl}: ${error.message}`);
//     }
//   }
//   addToDomainData(baseUrl, phoneNumbers);
// }

// function addToDomainData(domain, phoneNumbers) {
//   // Find the domain in the domainData array
//   const domainObj = domainData.find((obj) => obj.domain === domain);

//   if (domainObj) {
//     // If the domain is already in the array, add the phone numbers to its Set
//     domainObj.phoneNumbers = new Set([
//       ...domainObj.phoneNumbers,
//       ...phoneNumbers,
//     ]);
//   } else {
//     // If the domain is not in the array, create a new object with a Set for phone numbers
//     domainData.push({ domain, phoneNumbers: new Set(phoneNumbers) });
//   }
// }

// function displayResults() {
//   domainData.forEach((domainObj) => {
//     console.log(`Domain: ${domainObj.domain}`);
//     console.log("Phone Numbers:");
//     domainObj.phoneNumbers.forEach((phoneNumber) => {
//       console.log(phoneNumber);
//     });
//     console.log("-------------------------");
//   });
// }

// start();

//crawler.js

// const axios = require("axios");
// const cheerio = require("cheerio");
// const helpers = require("./helpers");

// let phoneNumbers = [];
// async function crawlContactPage(contactUrl) {
//   const response = await axios.get(contactUrl);
//   const html = response.data;
//   const $ = cheerio.load(html);
//   phoneNumbers = helpers.findPhoneNumbers($, "body", phoneNumbers);
//   return phoneNumbers;
// }

// function crawlFooter() {}

// async function crawlHomePage(baseUrl) {
//   const response = await axios.get(baseUrl);
//   const html = response.data;
//   const $ = cheerio.load(html);
//   phoneNumbers = helpers.findPhoneNumbers($, "body", phoneNumbers);
//   return phoneNumbers;
// }

// async function crawlContactPage(baseUrl) {
//   let phoneNumbers = [];
//   const response = await axios.get(baseUrl);
//   const html = response.data;
//   const $ = cheerio.load(html);
//   phoneNumbers = findPhoneNumbers($, "body", phoneNumbers);
//   return phoneNumbers;
// }

// module.exports = { crawlContactPage, crawlFooter, crawlHomePage, phoneNumbers };
