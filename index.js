const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const knex = require("knex");
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
  name: "auth-i",
  secret: "shhh.this.is.a.secret",
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 1, // 1 minute
    secure: false
  },
  store: new KnexSessionStore({ 
    tablename: "sessions",
    sidfieldname: "sid", 
    knex: db, 
    createtable: true, 
    clearInterval: 1000 * 60 * 10
  })
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

function protected(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You have not been authenticated." });
  }
}

// GET Users
server.get("/api/users", protected, (req, res) => {
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
      req.session.user = userInfo;
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
    .where({ username: userInfo.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(userInfo.password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Hello ${user.username}` });
      } else {
        releaseEvents.status(401).json({
          error: "Please make sure you have the correct username and password."
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while logging in." });
    });
});

// LOGOUT
server.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res
          .status(500)
          .json({ error: "There was an error while logging out." });
      } else {
        res.status(200).json({ message: "You have been logged out." });
      }
    });
  } else {
    res.json({ message: "You have already logged out." });
  }
});

server.listen(5000, () => console.log("Running on port 5000"));
