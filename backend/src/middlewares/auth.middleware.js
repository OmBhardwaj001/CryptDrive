import jwt, { decode } from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import dotenv from "dotenv";
import User from "../../model/user.model.js";


dotenv.config();

const Isloggedin = async (req, res, next) => {
  try{

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
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(400, "something went wrong", error);
  }
};

export { Isloggedin };
