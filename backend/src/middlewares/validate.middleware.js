import { userSchema, loginSchema } from "../validator/userschema.validator.js";
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

export { validateRegisterUser, validateLoginuser };
