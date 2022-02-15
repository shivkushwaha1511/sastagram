import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  path: "/socket.io",
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    allowHeaders: ["content-type"],
  },
});

// DB Connection
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR => ", err));

// MiddleWare
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);
app.use(morgan("dev"));

// Handling Requests(Auto-load routes)
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// Socket.io connect event
// io.on("connect", (socket) => {
//   socket.on("send-message", (msg) => {
//     socket.broadcast.emit("receive-message", msg);
//   });
// });

io.on("connect", (socket) => {
  socket.on("new-post", (post) => {
    // console.log(post);
    socket.broadcast.emit("fetch-new-post", post);
  });
});

const port = process.env.PORT || 8000;

http.listen(port, () => console.log(`Server running on port ${port}`));
