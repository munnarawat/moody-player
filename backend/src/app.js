const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SongsRouter = require("./routers/song.route");
const authRouter = require("./routers/auth.route");
const moodHistoryRouter = require("./routers/moodHistory.route");
const playHistoryRouter = require("./routers/playHistory.route");
const playlistRouter = require("./routers/playList.route");
const likeRouter = require("./routers/like.route")
const timeBaseRouter = require("./routers/timeBasePlaylist.route")
const app = express();
// middlewares
app.set("trust proxy", 1); // trust first proxy
app.use(
  cors({
    origin:[ "http://localhost:5173",
      'http://192.168.1.25:5173'
    ],
  
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
app.use("/api/history", moodHistoryRouter);
app.use("/api", playHistoryRouter);
app.use("/api/playlist", playlistRouter );
app.use("/api/likes", likeRouter);
app.use("/api/timePlaylist", timeBaseRouter)

module.exports = app;
