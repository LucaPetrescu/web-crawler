const cheerio = require("cheerio");
const axios = require("axios");
const readCSV = require("./helpers/csv-reader");
const helpers = require("./logic/helpers");

const path =
  "C:/Users/Luca Petrescu/Desktop/web-crawler/assets/sample-websites.csv";

async function crawl() {
  const domains = await readCSV.readCSVSingleColumn(path);
  let phoneBook = [];

  for (let i = 0; i < 10; i++) {
    const baseUrl = `https://${domains[i]}`;
    try {
      const response = await axios.get(baseUrl);
      const html = response.data;
      const $ = cheerio.load(html);
      const phoneNumbers = [];
      // const socialMediaLinks = helpers.findSocialMediaLinks($);
      const bodyPhoneNumbers = helpers.findPhoneNumbers(
        $,
        "body",
        phoneNumbers
      );
      const footerPhoneNumbers = helpers.findPhoneNumbers(
        $,
        "footer",
        phoneNumbers
      );
      const contactPageLink = $("a").filter(function () {
        return $(this).text().toLowerCase().includes("contact");
      });
      const contactPageUrl = new URL(contactPageLink.attr("href"), baseUrl)
        .href;
      const contactPagePhoneNumbers = await helpers.crawlContactPage(
        contactPageUrl
      );
      const allPhoneNumbers = bodyPhoneNumbers
        .concat(footerPhoneNumbers)
        .concat(contactPagePhoneNumbers);

      if (phoneNumbers.length === 0) {
        phoneBook.push({
          baseUrl,
          allPhoneNumbers:
            "No phone numbers found. Either anticrawling mechanism present on the website or there are no phone numbers on the website.",
        });
      } else {
        phoneBook.push({ baseUrl, allPhoneNumbers });
      }
    } catch (error) {
      if (error.errno === -3008) {
        phoneBook.push({
          baseUrl,
          allPhoneNumbers: `Error: ${domains[i]} not available`,
        });
      } else {
        phoneBook.push({
          baseUrl,
          allPhoneNumbers: `Error: ${error.message}`,
        });
      }
    }
  }
  console.log(helpers.removeDuplicates(phoneBook));
}

crawl();
