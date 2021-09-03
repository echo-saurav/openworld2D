var express = require("express");
// import express from "express";
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => console.log(`Running on port ${port}`));

console.log("backend started!");
