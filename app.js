// Load all the dependencies
const express = require("express");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const path = require("path");
const { host, user, password, schema } = require("./config/database-config");
const { getHomePage } = require("./routes/index");
const {
  addCustomerPage,
  addCustomer,
  editCustomerPage,
  editCustomer,
  deleteCustomer
} = require("./routes/customer");

// Create app
const app = express();

// Define port to use
const port = 5000;

// Create connection to mysql database
const database = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: schema
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

// Configured middleware for template engine
app.set("views", __dirname + "/views"); // set express to look in this folder to render the view
app.set("view engine", "ejs"); //configure template engine

// Configured middleware for body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parse from data client

// Configured middleware for public static folder
app.use(express.static(path.join(__dirname, "public"))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// ROUTES
app.get("/", getHomePage);
app.get("/add", addCustomerPage);
app.get("/edit/:id", editCustomerPage);
app.post("/edit/:id", editCustomer);
app.get("/delete/:id", deleteCustomer);
app.post("/add", addCustomer);

// set app to listen on the port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
