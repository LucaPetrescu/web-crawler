const cheerio = require("cheerio");
const axios = require("axios");
const readCSV = require("./helpers/csv-reader");
const crawler = require("./logic/crawler-logic");
const fs = require("fs");

async function crawl(path) {
  const domains = await readCSV.readCSVSingleColumn(path);
  let info = [];
  let addresses = [];

  for (let i = 0; i < 20; i++) {
    const baseUrl = `https://${domains[i]}`;
    try {
      const response = await axios.get(baseUrl);
      const html = response.data;
      const $ = cheerio.load(html);
      //------------------------------------------------
      const homePageResults = await crawler.crawlWebsitePage(baseUrl);
      const contactPageLink = $("a").filter(function () {
        return $(this).text().toLowerCase().includes("contact");
      });
      const contactPageUrl = new URL(contactPageLink.attr("href"), baseUrl)
        .href;
      const contactPageResults = await crawler.crawlWebsitePage(contactPageUrl);
      const footerResults = await crawler.crawlFooter($);
      const allPhoneNumbers = homePageResults.phoneNumbers
        .concat(contactPageResults.phoneNumbers)
        .concat(footerResults.phoneNumbers);
      const allSocialMediaLinks = homePageResults.socialMediaLinks
        .concat(contactPageResults.socialMediaLinks)
        .concat(footerResults.socialMediaLinks);
      const allEmailAddresses = homePageResults.addresses
        .concat(contactPageResults.addresses)
        .concat(footerResults.addresses);

      if (
        allPhoneNumbers.length === 0 &&
        allSocialMediaLinks.length === 0 &&
        allEmailAddresses.length === 0
      ) {
        info.push({
          baseUrl,
          allPhoneNumbers:
            "No phone numbers found. Either anticrawling mechanism present on the website or there are no phone numbers on the website.",
          allSocialMediaLinks:
            "No social media links found. Either anticrawling mechanism present on the website or there are no social media links on the website.",
          allEmailAddresses:
            "No email addresses found. Either anticrawling mechanism present on the website or there are no email addresses on the website.",
        });
      } else if (allPhoneNumbers.length === 0) {
        info.push({
          baseUrl,
          allPhoneNumbers:
            "No phone numbers found. Either anticrawling mechanism present on the website or there are no phone numbers on the website.",
          allSocialMediaLinks,
          allEmailAddresses,
        });
      } else if (allSocialMediaLinks.length === 0) {
        info.push({
          baseUrl,
          allPhoneNumbers,
          allSocialMediaLinks:
            "No social media links found. Either anticrawling mechanism present on the website or there are no social media links on the website.",
          allEmailAddresses,
        });
      } else if (allEmailAddresses.length === 0) {
        info.push({
          baseUrl,
          allPhoneNumbers,
          allSocialMediaLinks,
          allEmailAddresses:
            "No email addresses found. Either anticrawling mechanism present on the website or there are no email addresses on the website.",
        });
      } else {
        info.push({
          baseUrl,
          allPhoneNumbers,
          allSocialMediaLinks,
          allEmailAddresses,
        });
      }
    } catch (error) {
      console.log(error.message);
      if (error.errno === -3008) {
        info.push({
          baseUrl,
          allPhoneNumbers: `Error: ${domains[i]} not available`,
          allSocialMediaLinks: `Error: ${domains[i]} not available`,
          allEmailAddresses: `Error: ${domains[i]} not available`,
        });
      } else {
        info.push({
          baseUrl,
          allPhoneNumbers: `Error: ${error.message}`,
          allSocialMediaLinks: `Error: ${error.message}`,
          allEmailAddresses: `Error: ${error.message}`,
        });
      }
    }
  }
  const result = crawler.removeDuplicates(info);

  const jsonResult = JSON.stringify(result, null, 2);

  const filePath =
    "C:/Users/Luca Petrescu/Desktop/web-crawler/crawler/assets/data.json";

  fs.writeFile(filePath, jsonResult, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("Data written to JSON file successfully.");
    }
  });

  // console.log(info);
  return crawler.removeDuplicates(info);
}

module.exports = { crawl };
