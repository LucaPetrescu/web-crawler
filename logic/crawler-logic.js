const axios = require("axios");
const cheerio = require("cheerio");
const postal = require("node-postal");

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

function findAddresses($, element, addresses) {
  const text = $(element).text();
  const addressObj = postal.parser(text);
  console.log(addressObj);
  if (addressObj) {
    addresses.push(addressObj.fullAddress);
    return;
  }

  $(element)
    .children()
    .each((index, childElement) => {
      findAddresses($, childElement, addresses);
    });

  return addresses;
}

// async function crawlContactPage(baseUrl) {
//   let phoneNumbers = [];
//   const response = await axios.get(baseUrl);
//   const html = response.data;
//   const $ = cheerio.load(html);
//   phoneNumbers = findPhoneNumbers($, "body", phoneNumbers);
//   return phoneNumbers;
// }

async function crawlWebsitePage(baseUrl) {
  let phoneNumbers = [];
  let socialMediaLinks = [];
  // let addressess = [];
  const response = await axios.get(baseUrl);
  const html = response.data;
  const $ = cheerio.load(html);
  phoneNumbers = findPhoneNumbers($, "body", phoneNumbers);
  // addressess = findAddresses($, "body", addressess);
  socialMediaLinks = findSocialMediaLinks($);
  return { phoneNumbers, socialMediaLinks };
}

async function crawlFooter($) {
  let phoneNumbers = [];
  let socialMediaLinks = [];
  phoneNumbers = findPhoneNumbers($, "footer", phoneNumbers);
  socialMediaLinks = findSocialMediaLinks($);
  return { phoneNumbers, socialMediaLinks };
}

function removeDuplicates(information) {
  let mergedInformation = [];

  for (let i = 0; i < information.length; i++) {
    let baseUrl = information[i].baseUrl;
    let existingIndex = mergedInformation.findIndex(
      (item) => item.baseUrl === baseUrl
    );

    if (existingIndex === -1) {
      mergedInformation.push({
        baseUrl,
        allPhoneNumbers: [],
        allSocialMediaLinks: [],
      });
      existingIndex = mergedInformation.length - 1;
    }

    if (Array.isArray(information[i].allPhoneNumbers)) {
      const phoneNumbers = information[i].allPhoneNumbers.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      mergedInformation[existingIndex].allPhoneNumbers.push(...phoneNumbers);
    } else {
      mergedInformation[existingIndex].allPhoneNumbers =
        information[i].allPhoneNumbers;
    }

    if (Array.isArray(information[i].allSocialMediaLinks)) {
      const socialMediaLinks = information[i].allSocialMediaLinks.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      mergedInformation[existingIndex].allSocialMediaLinks.push(
        ...socialMediaLinks
      );
    } else {
      mergedInformation[existingIndex].allSocialMediaLinks =
        information[i].allSocialMediaLinks;
    }
  }

  return mergedInformation;
}

module.exports = {
  findSocialMediaLinks,
  findPhoneNumbers,
  findAddresses,
  // crawlContactPage,
  removeDuplicates,
  crawlFooter,
  crawlWebsitePage,
};
