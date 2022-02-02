import express from "express";
import { requireSignin } from "../middlewares";

const router = express.Router();
import { register, login, currentUser } from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);

module.exports = router;
