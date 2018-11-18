// Load all the dependencies
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const { host, user, password } = require("./config/database-config");

// Create app
const app = express();

// Define port to use
const port = 5000;

// Create connection to mysql database
const database = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: "socka"
});

// Connect to the database
database.connect(err => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.database = database;

// Configure the middleware
app.set("port", process.env.PORT || port); // set express to use this port
app.set("views", __dirname + "/view"); // set express to look in this folder to render the view
app.set("view engine", "ejs"); //configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse from data client
app.use(express.static(path.join(__dirname, "public"))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// set app to listen on the port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
