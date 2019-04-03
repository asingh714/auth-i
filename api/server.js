const middleware = require("../config/middleware");
const express = require("express");
const session = require("express-session");

const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/users-router");
const sessionConfig = require("../auth/session-config");

const server = express();

middleware(server);
server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

module.exports = server;
