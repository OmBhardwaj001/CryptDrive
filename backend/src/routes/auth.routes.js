import { Router } from "express";
import {
  registerUser,
  verifyUser,
  login,
  logout,
  getProfile,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changeCurrentPassword,
  refreshToken,
} from "../controller/auth.controller.js";
import {
  validateRegisterUser,
  validateLoginuser,
  validateEmail,
  validatepasswordreset,
  validatecurrentpassword,
} from "../middlewares/validate.middleware.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegisterUser, registerUser);
router.route("/verify/:token").get(verifyUser);
router.route("/login").post(validateLoginuser, login);
router.route("/logout").get(Isloggedin, logout);
router.route("/profile").get(Isloggedin, getProfile);
router
  .route("/resend")
  .post(Isloggedin, validateEmail, resendVerificationEmail);
router.route("/forgotpassword").post(validateEmail, forgotPassword);
router.route("/reset/:token").post(validatepasswordreset, resetPassword);
router
  .route("/changeCurrentpassword")
  .post(validatecurrentpassword, changeCurrentPassword);
router.route("/refreshtoken").get(refreshToken);

export default router;
