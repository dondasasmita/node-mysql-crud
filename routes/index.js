const getHomePage = (req, res) => {
  let query = "SELECT * FROM `players` ORDER BY id ASC";

  // execute the query
  database.query(query, (err, result) => {
    if (err) {
      res.redirect("/");
    }
    res.render("index.ejs", {
      title: "Welcome to Socka | View Players",
      players: result
    });
  });
};
