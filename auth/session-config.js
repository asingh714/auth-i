require("dotenv").config();
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const configuredKnex = require("../data/dbConfig");

module.exports = {
  name: "auth-i",
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: configuredKnex,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 30
  })
};
