const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("knex");
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());

// GET Users
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


// REGISTER User 
server.post("/api/register", (req, res) => {
  const userInfo = req.body;

  const hash = bcrypt.hashSync(userInfo.password, 14);

  userInfo.password = hash;

  db("users")
    .insert(userInfo)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "There was an error while creating the user." });
    });
});

// LOGIN User
server.post("/api/login", (req, res) => {
    const userInfo = req.body;

    db("users")
    .where({ username: userInfo.username})
    .first()
    .then(user => {
      if (user&& bcrypt.compareSync(userInfo.password, user.password)) {
        res.status(200).json({ message: `Hello ${user.username}` })
      } else {
        releaseEvents.status(401).json({ error: "Please make sure you have the correct username and password." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while logging in." })
    })
})



server.listen(5000, () => console.log("Running on port 5000"));
