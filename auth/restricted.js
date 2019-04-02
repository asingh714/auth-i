const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs");

function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    db("users")
    .where({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next()
      } else {
        res.status(401).json({ message: "The credentials are invalid." })
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Sorry, there was an error." });
    });
  } else {
    res.status(400).json({ message: "Please provide a username and password." });
  }
}


module.exports = restricted;