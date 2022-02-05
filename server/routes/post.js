import express from "express";
import { requireSignin } from "../middlewares";
import formidable from "express-formidable";
import { createPost, imageUpload } from "../controllers/post";

const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post(
  "/image-upload",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  imageUpload
);

module.exports = router;
