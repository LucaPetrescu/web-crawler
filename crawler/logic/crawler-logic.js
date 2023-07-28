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

  return phoneNumbers;
}

function findAddresses($, element, addresses) {
  const text = $(element).text();
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  if (matches) {
    addresses.push(...matches);
    return;
  }

  $(element)
    .children()
    .each((index, childElement) => {
      findAddresses($, childElement, addresses);
    });

  return addresses;
}

async function crawlWebsitePage(baseUrl) {
  let phoneNumbers = [];
  let socialMediaLinks = [];
  let addresses = [];
  const response = await axios.get(baseUrl);
  const html = response.data;
  const $ = cheerio.load(html);
  phoneNumbers = findPhoneNumbers($, "body", phoneNumbers);
  addresses = findAddresses($, "body", addresses);
  socialMediaLinks = findSocialMediaLinks($);
  return { phoneNumbers, socialMediaLinks, addresses };
}

async function crawlFooter($) {
  let phoneNumbers = [];
  let socialMediaLinks = [];
  let addresses = [];
  addresses = findAddresses($, "footer", addresses);
  phoneNumbers = findPhoneNumbers($, "footer", phoneNumbers);
  socialMediaLinks = findSocialMediaLinks($);
  return { phoneNumbers, socialMediaLinks, addresses };
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
        allEmailAddresses: [],
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

    // if (Array.isArray(information[i].allEmailAddresses)) {
    //   const emailAddresses = information[i].allEmailAddresses.filter(
    //     (value, index, self) => self.indexOf(value) === index
    //   );
    //   mergedInformation[existingIndex].allEmailAddresses.push(
    //     ...emailAddresses
    //   );
    // } else {
    //   mergedInformation[existingIndex].allEmailAddresses =
    //     information[i].emailAddresses;
    // }
  }

  return mergedInformation;
}

module.exports = {
  removeDuplicates,
  crawlFooter,
  crawlWebsitePage,
};
