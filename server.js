const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = require("./app");

dotenv.config({ path: "./.env" });

// Connect database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected..."))
  .catch((error) => console.log("An error occured..."));

// Serve client folder
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

//   Listen to port
const PORT = 4000;
exports.expressServer = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}...`)
);
