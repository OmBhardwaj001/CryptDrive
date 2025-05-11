import { Router } from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  userProfile,
  resendEmailVerification,
  forgotPasswordReq,
  resetPassword,
  changeCurrentPassword,
} from "../controller/auth.controller.js";
import {
  validateRegisterUser,
  validateLoginuser,
  validateEmail,
  validatepasswordreset,
  validatecurrentpassword,
} from "../middlewares/validate.middleware.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";
import { authLimitter } from "../middlewares/limitter.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(authLimitter, upload.single("avatar"), validateRegisterUser, registerUser);

router.route("/verify/:token").get(verifyUser);

router.route("/login").post(authLimitter, validateLoginuser, loginUser);

router.route("/logout").get(Isloggedin, logoutUser);

router.route("/profile").get(Isloggedin, userProfile);

router
  .route("/resend")
  .post(Isloggedin, validateEmail, resendEmailVerification);

router.route("/forgotpassword").post(authLimitter, validateEmail, forgotPasswordReq);

router.route("/reset/:token").post(authLimitter, validatepasswordreset, resetPassword);

router
  .route("/changeCurrentpassword")
  .post(validatecurrentpassword, changeCurrentPassword);

router.route("/refreshtoken").get(refreshAccessToken);

export default router;
