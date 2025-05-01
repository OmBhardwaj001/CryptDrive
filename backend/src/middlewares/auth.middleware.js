import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import dotenv from "dotenv";
import User from "../model/user.model.js";

dotenv.config();

const Isloggedin = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      throw new ApiError(400, "invalid token");
    }

    const user = await User.findById(decoded._id);

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
