import { rateLimit } from "express-rate-limit";

const authLimitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export { authLimitter };
