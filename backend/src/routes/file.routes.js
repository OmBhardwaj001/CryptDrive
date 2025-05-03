import { Router } from "express";
import { uploadfile } from "../controller/file.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(upload.single("file"), Isloggedin, uploadfile);

export default router;
