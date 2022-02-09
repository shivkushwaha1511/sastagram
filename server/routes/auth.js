import express from "express";
import { requireSignin } from "../middlewares";

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
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser); //Authenticate user loggedin or not
router.post("/forgot-password", forgotPassword);
router.put("/profile-update", requireSignin, profileUpdate);
router.get("/find-people", requireSignin, findPeople);
router.put("/follow-user", requireSignin, addFollower, addFollowing);

module.exports = router;
