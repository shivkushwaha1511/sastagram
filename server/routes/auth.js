import express from "express";
import { isAdmin, requireSignin } from "../middlewares";

const router = express.Router();
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  addFollower,
  addFollowing,
  userFollowing,
  removeFollower,
  removeFollowing,
  userFollower,
  searchUser,
  fetchUser,
} from "../controllers/auth";

// Register login
router.post("/register", register);
router.post("/login", login);

// Authenticating user for accessing pages if loggedin
router.get("/current-user", requireSignin, currentUser); //Authenticate user loggedin or not

router.post("/forgot-password", forgotPassword);
router.put("/profile-update", requireSignin, profileUpdate);

// Fetching Users that are not followed
router.get("/find-people", requireSignin, findPeople);

// Follow Unfollow
router.put("/follow-user", requireSignin, addFollower, addFollowing);
router.put("/unfollow-user", requireSignin, removeFollower, removeFollowing);

// Fetching following followers
router.get("/user-following", requireSignin, userFollowing);
router.get("/user-follower", requireSignin, userFollower);

// Search user
router.get("/search-user/:query", searchUser);

// Fetch user from username
router.get("/fetch-user/:username", fetchUser);

// Authenticating admin for accessing pages
router.get("/current-admin", requireSignin, isAdmin, currentUser);

module.exports = router;
