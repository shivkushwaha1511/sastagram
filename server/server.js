import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();

// DB Connection
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR => ", err));

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Handling Requests
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));
