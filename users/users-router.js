const express = require("express");
const router = express.Router();

const db = require("../data/dbConfig");
const restricted = require("../auth/restricted");

router.get("/users", restricted, (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;