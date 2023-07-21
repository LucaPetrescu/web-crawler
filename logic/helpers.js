const axios = require("axios");
const cheerio = require("cheerio");

function findSocialMediaLinks($) {
  const socialMediaLinks = [];

  $("a").each((index, element) => {
    const href = $(element).attr("href");
    if (
      href &&
      (href.includes("facebook.com") ||
        href.includes("twitter.com") ||
        href.includes("instagram.com") ||
        href.includes("google.com") ||
        href.includes("linkedin.com"))
    ) {
      socialMediaLinks.push(href);
    }
  });

  $("footer").each((index, element) => {
    const href = $(element).attr("href");
    if (
      href &&
      (href.includes("facebook.com") ||
        href.includes("twitter.com") ||
        href.includes("instagram.com") ||
        href.includes("google.com") ||
        href.includes("linkedin.com"))
    ) {
      socialMediaLinks.push(href);
    }
  });

  return socialMediaLinks;
}

function findPhoneNumbers($, element, phoneNumbers) {
  const phoneRegex =
    /(?:\+\d{1,2}\s?)?(?:\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}/g;

  const text = $(element).text();
  const matches = text.match(phoneRegex);
  if (matches) {
    phoneNumbers.push(...matches);
  }

  $(element)
    .children()
    .each((index, childElement) => {
      findPhoneNumbers($, childElement, phoneNumbers);
    });

  return phoneNumbers; // Return the accumulated phone numbers array
}

async function crawlContactPage(baseUrl) {
  let phoneNumbers = [];
  const response = await axios.get(baseUrl);
  const html = response.data;
  const $ = cheerio.load(html);
  phoneNumbers = findPhoneNumbers($, "body", phoneNumbers);
  return phoneNumbers;
}

function removeDuplicates(information) {
  let newPhoneBook = [];
  for (let i = 0; i < information.length; i++) {
    if (Array.isArray(information[i].allPhoneNumbers)) {
      let phoneNumbers = information[i].allPhoneNumbers.filter(
        (value, index, self) => {
          return self.indexOf(value) === index;
        }
      );
      baseUrl = information[i].baseUrl;
      newPhoneBook.push({ baseUrl, phoneNumbers });
    } else {
      baseUrl = information[i].baseUrl;
      let allPhoneNumbers = information[i].allPhoneNumbers;
      newPhoneBook.push({ baseUrl, allPhoneNumbers });
    }
  }
  return newPhoneBook;
}

module.exports = {
  findSocialMediaLinks,
  findPhoneNumbers,
  crawlContactPage,
  removeDuplicates,
};
