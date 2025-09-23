import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import session from "express-session";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(
  session({
    secret: process.env.LOCKED_FOLDER_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 5 * 60 * 1000,
    },
  }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/file", fileRoutes);
app.use("/api/v1/folder", folderRoutes);

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
