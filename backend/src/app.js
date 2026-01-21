const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SongsRouter = require("./routers/song.route");
const authRouter = require("./routers/auth.route");
const moodHistoryRouter = require("./routers/moodHistory.route");
const playHistoryRouter = require("./routers/playHistory.route");
const playlistRouter = require("./routers/playList.route")
const app = express();
// middlewares
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRouter);
app.use("/api", SongsRouter);
app.use("/api", moodHistoryRouter);
app.use("/api", playHistoryRouter);
app.use("/api/playlist", playlistRouter )

module.exports = app;
