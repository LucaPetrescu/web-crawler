const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const db = require("./utils/keys").MongoURI;
const routes = require("./routes/routes");

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/", routes);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongoose Connected");
  })
  .catch((err) => {
    console.log(err);
  });
