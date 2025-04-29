import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/Async_handler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTemporaryToken,
} from "../utils/generateToken,js";
import sendMail from "../utils/mail.js";
import { Prisma, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existinguser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existinguser) {
    throw new ApiError(400, "user already registered");
  }

  const newUser = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: password,
    },
  });

  if (!newUser) {
    throw new ApiError(400, "user not created");
  }

  const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken();

  await prisma.user.update({
    where: {
      id: newUser.id,
    },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiry: tokenExpiry,
    },
  });

  await sendMail({
    username: newUser.username,
    email: newUser.email,
    url: `${process.env.BASE_URL}/api/v1/auth/verify/${unHashedToken}`,
    subject: "Email verification",
    mailType: "verify",
  });

  res
    .status(200)
    .json(new ApiResponse(200, `email sent successfully to ${newUser.email}`));
});

const verifyUser = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "token not found");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findUnique({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, "invalid token");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: undefined,
      emailVerificationTokenExpiry: undefined,
      isVerified: true,
    },
  });

  res.status(200).json(new ApiResponse(200), "user verified");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const ismatched = bcrypt.compare(password, user.password);

  if (!ismatched) {
    throw new ApiError(400, "incorrect password");
  }

  const refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: process.env.ACCESS_COOKIE_EXPIRY,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: process.env.REFRESH_COOKIE_EXPIRY,
  });

  res.status(200).json(new ApiResponse(200, "user is logged in successfully"));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
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

const resendVerificationEmail = asyncHandler(async (req, res) => {});

const forgotPassword = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {});

export { registerUser, verifyUser, login, logout, getProfile };
