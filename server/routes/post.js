import express from "express";
import { requireSignin } from "../middlewares";

const router = express.Router();
import { createPost } from "../controllers/post";

router.post("/create-post", requireSignin, createPost);

module.exports = router;
