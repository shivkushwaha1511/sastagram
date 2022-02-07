import express from "express";
import { requireSignin } from "../middlewares";
import formidable from "express-formidable";
import { createPost, imageUpload, userPosts } from "../controllers/post";

const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post(
  "/image-upload",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  imageUpload
);

router.get("/user-posts", requireSignin, userPosts);

module.exports = router;
