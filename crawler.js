const cheerio = require("cheerio");
const axios = require("axios");
const readCSV = require("./helpers/csv-reader");

function findSocialMediaLinks() {}
function findPhoneNumbers() {}
function findAdresses() {}

async function crawl() {
  const domains = await readCSV();

  //   for (let i = 0; i < domains.length; i++) {
  //     const baseUrl = `https://${domains[i]}`;
  //     try {
  //       const response = await axios.get(baseUrl);
  //       const html = response.data;
  //       const $ = cheerio.load(html);
  //       console.log($);
  //       const phoneNumbers = html.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g);
  //       console.log("Phone Numbers:", phoneNumbers);

  //       const socialMediaLinks = [];
  //       $("a").each((index, element) => {
  //         const href = $(element).attr("href");
  //         if (
  //           href &&
  //           (href.includes("facebook.com") ||
  //             href.includes("twitter.com") ||
  //             href.includes("instagram.com") ||
  //             href.includes("google.com"))
  //         ) {
  //           socialMediaLinks.push(href);
  //         }
  //       });
  //       console.log("Social Media Links:", socialMediaLinks);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
}

crawl();
