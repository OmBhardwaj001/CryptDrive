import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

const Isloggedin = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken) {
      if (!refreshToken) {
        throw new ApiError(400, "user is not logged in");
      }

      const refreshdecoded = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const newaccessToken = generateAccessToken(refreshdecoded._id);

      res.cookie("accessToken", newaccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: process.env.ACCESS_COOKIE_EXPIRY,
      });

      req.user = refreshdecoded;

      return next();
    } else {
      return next();
    }
  } catch (error) {
    throw new ApiError(400, "invalid token", error);
  }
};

export { Isloggedin };
