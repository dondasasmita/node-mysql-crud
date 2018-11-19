/**
 * This file contain the routes the handler to get home page.
 */

module.exports = {
  getHomePage: (req, res) => {
    let query = "SELECT * FROM `customers` ORDER BY id ASC";

    // execute the query
    database.query(query, (err, result) => {
      if (err) {
        res.redirect("/");
      }
      res.render("index.ejs", {
        title: "Welcome to iWorkshop | View Customers",
        customers: result
      });
    });
  }
};
