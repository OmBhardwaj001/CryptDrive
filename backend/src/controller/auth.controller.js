import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
} from "../utils/generateToken.js";
import sendMail from "../utils/mail.js";
import User from "../model/user.model.js";

dotenv.config();

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existinguser = await User.findOne({ email });

  if (existinguser) {
    throw new ApiError(400, "user already registered");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(400, "user not created");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  await sendMail({
    username: user.username,
    email: user.email,
    url: `${process.env.BASE_URL}/api/v1/auth/verify/${unHashedToken}`,
    subject: "Email verification",
    mailType: "verify",
  });

  res
    .status(200)
    .json(new ApiResponse(200, `email sent successfully to ${user.email}`));
});

// check if user is already verified
// give seperate msg for invalid token and token is expired

const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "token not found");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "invalid token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save();

  res.status(200).json(new ApiResponse(200), "User is verified successfully");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Incorrect email or password");
  }

  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    throw new ApiError(400, "Incorrect email or password");
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "Development",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, "User is logged in successfully"));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: Number(req.user._id),
    },
  });

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  res.status(200).json(new ApiResponse(200, "profile:", user));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  });

  res.clearCookie("refeshToken", {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  });

  res.status(200).json(new ApiResponse(200, "user logged out successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(400, "email not registerd");
  }

  const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

  await db.user.update({
    where: {
      email: user.email,
    },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiry: tokenExpiry,
    },
  });

  await sendMail({
    username: user.username,
    email: user.email,
    url: `${process.env.BASE_URL}/api/v1/auth/verify/${unHashedToken}`,
    subject: "Email verification",
    mailType: "verify",
  });

  res
    .status(200)
    .json(new ApiResponse(200, `email sent successfully to ${user.email}`));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(400, "invalid email");
  }

  const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpiry: tokenExpiry,
    },
  });

  await sendMail({
    username: user.username,
    email: user.email,
    url: `${process.env.BASE_URL}/api/v1/auth/reset/${unHashedToken}`,
    subject: "Email verification",
    mailType: "reset",
  });

  res
    .status(200)
    .json(new ApiResponse(200, `password reset email sent to ${user.email}`));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { email, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await db.user.findFirst({
    where: {
      email: email,
      passwordResetToken: hashedToken,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, "invalid token user not found");
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: password,
      passwordResetExpiry: null,
      passwordResetToken: null,
    },
  });

  res.status(200).json(new ApiResponse(200, "password reset successful"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, currentpassword, newpassword, confirmpassword } = req.body;

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(currentpassword)
    .digest("hex");

  if (hashedPassword != user.password) {
    throw new ApiError(400, "incorrect password");
  }

  const newpasswordHashed = crypto
    .createHash("sha256")
    .update(newpassword)
    .digest("hex");

  if (newpasswordHashed === hashedPassword) {
    throw new ApiError(400, "new password must be different from older one");
  }

  if (newpassword != confirmpassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  await db.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: newpassword,
    },
  });

  res.status(200).json(new ApiResponse(200, "password changed successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "refresh token not found");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!decoded) {
    throw new ApiError(400, "invalid token");
  }

  const newaccessToken = jwt.sign(
    { _id: decoded._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );

  res.cookie("accessToken", newaccessToken, {
    httpOnly: true,
    secure: true,
    maxAge: process.env.ACCESS_COOKIE_EXPIRY,
  });

  res.status(200).json(new ApiResponse(200, "accesstoken refreshed"));
});

export {
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
};
