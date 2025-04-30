import {
  userSchema,
  loginSchema,
  emailScehma,
  passwordResetSchema,
} from "../validator/userschema.validator.js";
import { ApiError } from "../utils/api.error.js";

const validateRegisterUser = (req, res, next) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation error , please provide valid data",
      result.error.issues.message,
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
      result.error.issues.message,
    );
  }
  next();
};

const validateEmail = (req, res, next) => {
  const result = emailScehma.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "validation error, please provide valid data",
      result.error.issues.message,
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
      result.error.issues.message,
    );
  }
  next();
};

export {
  validateRegisterUser,
  validateLoginuser,
  validateEmail,
  validatepasswordreset,
};
