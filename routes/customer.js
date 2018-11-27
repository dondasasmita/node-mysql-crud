/**
 * This file contain all the handlers for the customers page such as adding a customer, updating a customer's details and deleting a customer.
 */

// Load module
const fs = require("fs");

module.exports = {
  // Define  add customer page
  addCustomerPage: (req, res) => {
    res.render("add-customer.ejs", {
      title: "Welcome to Socka | Add a new customer",
      message: ""
    });
  },
  // Define add customer function req and res
  addCustomer: (req, res) => {
    // if request does not exist
    if (!req.files) {
      return res.status(400).send("No files were uploaded");
    }

    // define all variables and get from request body
    let message = "";
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let address = req.body.address;
    let mobile = req.body.mobile;
    let username = req.body.username;
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split("/")[1];
    image_name = username + "." + fileExtension;

    /**
     * NEED TO REFACTOR THE CODE BELOW
     * Database query insert into may not need the username query
     */

    // define the username query
    let usernameQuery =
      "SELECT user_name FROM `customers` WHERE user_name = '" + username + "'";

    // query the database
    database.query(usernameQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        message = "Username already exists";
        res.render("add-customer.ejs", {
          message,
          title: "Welcome to iWorkshop | Add a new customer"
        });
      } else {
        // Check file type before uploading
        if (
          uploadedFile.mimetype === "image/png" ||
          uploadedFile.mimetype === "image/jpeg" ||
          uploadedFile.mimetype === "image/gif"
        ) {
          // upload the file to /public/assets/image directory
          uploadedFile.mv(`public/assets/img/${image_name}`, err => {
            if (err) {
              return res.status(500).send(err);
            }
            let query =
              "INSERT INTO `customers` (first_name, last_name, address, mobile, image, user_name) VALUES ('" +
              first_name +
              "', '" +
              last_name +
              "', '" +
              address +
              "', '" +
              mobile +
              "', '" +
              image_name +
              "', '" +
              username +
              "')";

            database.query(query, (err, result) => {
              if (err) {
                return res.status(500).send(err);
              }
              res.redirect("/");
            });
          });
        } else {
          message =
            "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
          res.render("add-customer.ejs", {
            message,
            title: "Welcome to Socka | Add a new customer"
          });
        }
      }
    });
  },

  // Define editCustomerPage
  editCustomerPage: (req, res) => {
    let customerID = req.params.id;
    let query = "SELECT * FROM `customers` WHERE id = '" + customerID + "'";
    database.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.render("edit-customer.ejs", {
        title: "Edit Customer",
        customer: result[0],
        message: ""
      });
    });
  },

  // Define editCustomer function
  editCustomer: (req, res) => {
    let customerID = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let address = req.body.address;
    let mobile = req.body.mobile;

    let query =
      "UPDATE `customers` SET `first_name` = '" +
      first_name +
      "', `last_name` = '" +
      last_name +
      "', `address` = '" +
      address +
      "', `mobile` = '" +
      mobile +
      "' WHERE `customers`.`id` = '" +
      customerID +
      "'";

    database.query(query, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect("/");
    });
  },

  // Delete customers function
  deleteCustomer: (req, res) => {
    let customerID = req.params.id;
    let getImageQuery =
      'SELECT image FROM `customers` WHERE id = "' + customerID + '"';
    let deleteCustomerQuery =
      'DELETE FROM customers WHERE id = "' + customerID + '"';

    database.query(getImageQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      let image = result[0].image;
      fs.unlink(`public/assets/img/${image}`, err => {
        if (err) {
          return res.status(500).send(err);
        }
        database.query(deleteCustomerQuery, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect("/");
        });
      });
    });
  }
};
