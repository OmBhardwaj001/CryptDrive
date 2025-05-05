import { Router } from "express";
import {
  uploadfile,
  getfile,
  filepreview,
} from "../controller/file.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(upload.single("file"), Isloggedin, uploadfile);
router.route("/getfiles").post(Isloggedin, getfile);
router.route("/:filename/preview").get(filepreview);

export default router;
