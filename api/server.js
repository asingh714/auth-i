const middleware = require("../config/middleware");
const express = require("express");
const server = express();
middleware(server);

const authRouter = require("../data/routes/auth-router");

server.use("/api", authRouter);


module.exports = server;
