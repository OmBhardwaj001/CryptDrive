import { Router } from "express";
import {
  registerUser,
  verifyUser,
  login,
  logout,
  getProfile,
} from "../controller/auth.controller.js";
import {
  validateRegisterUser,
  validateLoginuser,
} from "../middlewares/validate.middleware.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegisterUser, registerUser);
router.route("/verify/:token").get(verifyUser);
router.route("/login").post(validateLoginuser, login);
router.route("/logout").get(Isloggedin, logout);
router.route("/profile").get(Isloggedin, getProfile);
