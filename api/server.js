const middleware = require("../config/middleware");
const express = require("express");
const server = express();
middleware(server);

const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/users-router");


server.use("/api", authRouter);
server.use("/api/users", usersRouter);


module.exports = server;
