const express = require("express");
const SongsRouter = require("./routers/song.route");
const app = express();
const cors = require("cors");

app.use(cors())
app.use(express.json());

app.use("/api",SongsRouter);



module.exports = app;