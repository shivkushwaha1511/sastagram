import express from "express";
import { requireSignin } from "../middlewares";

const router = express.Router();
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser); //Authenticate user loggedin or not
router.post("/forgot-password", forgotPassword);
router.put("/profile-update", requireSignin, profileUpdate);

module.exports = router;
