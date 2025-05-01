import {
  userSchema,
  loginSchema,
  emailSchema,
  passwordResetSchema,
  changecurrentpasswordSchema,
} from "../validator/userschema.validator.js";
import { ApiError } from "../utils/api.error.js";

const validateRegisterUser = (req, res, next) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation error , please provide valid data",
      result.error.issues[0]?.message,
    );
  }

  next();
};

const validateLoginuser = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation error, please provide valid data",
      result.error.issues[0]?.message,
    );
  }
  next();
};

const validateEmail = (req, res, next) => {
  const result = emailSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation error, please provide valid data",
      result.error.issues[0]?.message,
    );
  }

  next();
};

const validatepasswordreset = (req, res, next) => {
  const result = passwordResetSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation error, please provide valid data",
      result.error.issues[0]?.message,
    );
  }
  next();
};

const validatecurrentpassword = (req, res, next) => {
  const result = changecurrentpasswordSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation error, please provide valid data",
      result.error.issues[0]?.message,
    );
  }
  next();
};

export {
  validateRegisterUser,
  validateLoginuser,
  validateEmail,
  validatepasswordreset,
  validatecurrentpassword,
};
