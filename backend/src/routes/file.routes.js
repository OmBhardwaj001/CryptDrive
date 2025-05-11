import { Router } from "express";
import {
  uploadfile,
  getfile,
  filepreview,
  removefilefromfolder,
  download,
} from "../controller/file.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(upload.single("file"), Isloggedin, uploadfile);
router.route("/getfiles").post(Isloggedin, getfile);
router.route("/:filename/preview").get(Isloggedin, filepreview);
router
  .route("/removefromfolder/:namebyuser")
  .get(Isloggedin, removefilefromfolder);
router.route("/:namebyuser/download").get(Isloggedin, download);

export default router;

