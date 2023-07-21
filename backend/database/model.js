const mongoose = require("mongoose");

const DomainsSchema = new mongoose.Schema(
  {
    domainName: {
      type: String,
    },
    companyName: { type: String },
    companyLegalName: { type: String },
    companyAllAvailableNames: { type: String },
    allPhoneNumbers: { type: String },
    allSocialMediaNames: { type: String },
    allAddresses: { type: String },
  },
  { collection: "domains" }
);

const Domains = mongoose.model("Domains", DomainsSchema);

module.exports = Domains;
