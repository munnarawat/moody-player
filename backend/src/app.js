const express = require("express");
const SongsRouter = require("./routers/song.route");
const authRouter = require("./routers/auth.route");
const moodHistoryRouter = require("./routers/moodHistory.route")
const playHistoryRouter = require("./routers/playHistory.route");
const cookieParser = require("cookie-parser");

const app = express();
const cors = require("cors");

app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api",SongsRouter);
app.use("/api/auth",authRouter);
app.use("/api", moodHistoryRouter)
app.use("/api", playHistoryRouter)



module.exports = app;