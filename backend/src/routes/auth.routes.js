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
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/verify/:token").get(verifyUser);
router.route("/login").post(validateLoginuser, loginUser);
router.route("/logout").get(Isloggedin, logoutUser);
router.route("/profile").get(Isloggedin, userProfile);
router
  .route("/resend")
  .post(Isloggedin, validateEmail, resendEmailVerification);
router.route("/forgotpassword").post(validateEmail, forgotPasswordReq);
router.route("/reset/:token").post(validatepasswordreset, resetPassword);
router
  .route("/changeCurrentpassword")
  .post(validatecurrentpassword, changeCurrentPassword);
router.route("/refreshtoken").get(refreshAccessToken);

export default router;
