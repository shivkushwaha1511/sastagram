import express from "express";
import { requireSignin, canUpdatePost } from "../middlewares";
import formidable from "express-formidable";
import {
  createPost,
  imageUpload,
  userPosts,
  currentPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  removeComment,
  totalPost,
} from "../controllers/post";

const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post(
  "/image-upload",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  imageUpload
);

router.get("/user-posts/:page", requireSignin, userPosts);
router.get("/current-post/:_id", requireSignin, currentPost);
router.put("/post-update/:_id", requireSignin, canUpdatePost, updatePost);
router.delete("/delete-post/:_id", requireSignin, canUpdatePost, deletePost);

// like Unlike
router.put("/like-post", requireSignin, likePost);
router.put("/unlike-post", requireSignin, unlikePost);

// Comment
router.put("/add-comment", requireSignin, addComment);
router.put("/remove-comment", requireSignin, removeComment);

// Total posts
router.get("/total-post", totalPost);

module.exports = router;
