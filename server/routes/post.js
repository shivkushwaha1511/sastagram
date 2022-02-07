import express from "express";
import { requireSignin, canUpdatePost } from "../middlewares";
import formidable from "express-formidable";
import {
  createPost,
  imageUpload,
  userPosts,
  editPost,
  updatePost,
  deletePost,
} from "../controllers/post";

const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post(
  "/image-upload",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  imageUpload
);

router.get("/user-posts", requireSignin, userPosts);
router.get("/edit-post/:_id", requireSignin, editPost);
router.put("/post-update/:_id", requireSignin, canUpdatePost, updatePost);
router.delete("/delete-post/:_id", requireSignin, canUpdatePost, deletePost);

module.exports = router;
