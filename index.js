const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());

server.get("/api/users", (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "The users could not be retrieved." });
    });
});

server.listen(5000, () => console.log("Running on port 5000"));
