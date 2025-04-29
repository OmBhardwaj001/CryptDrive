import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

function generateAccessToken(userid) {
  return jwt.sign({ _id: userid }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

function generateRefreshToken(userid) {
  return jwt.sign({ _id: userid }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}

function generateTemporaryToken() {
  const unhashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  const tokenexpiry = Date.now() + 20 * 60 * 1000;

  return { unhashedToken, hashedToken, tokenexpiry };
}

export { generateAccessToken, generateTemporaryToken, generateRefreshToken };
