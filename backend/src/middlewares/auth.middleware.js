import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import dotenv from "dotenv";
import { db } from "../libs/db.lib.js";

dotenv.config();

const Isloggedin = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      throw new ApiError(400, "accesstoken not found, user is not logged in");
    }

    const decoded = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );
    if (!decoded) {
      throw new ApiError(400, "invalid token");
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded._id,
      },
    });

    if (!user) {
      throw new ApiError(400, "user not found");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(400, "something went wrong", error);
  }
};

export { Isloggedin };
