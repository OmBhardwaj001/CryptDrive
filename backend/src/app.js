import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "../src/routes/file.routes.js";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/file", fileRoutes);

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode ?? 500;

  console.log(err);

  res.status(statusCode).json({
    statusCode,
    message: err.message ?? "Internal server error",
    error: err.error ?? [],
    success: statusCode < 400,
  });
});

export default app;
