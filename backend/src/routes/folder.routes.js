import { Router } from "express";
import {
  createFolder,
  addfileTofolder,
} from "../controller/folder.controller.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createfolder").post(Isloggedin, createFolder);
router.route("/addfiletofolder/:foldername").post(Isloggedin, addfileTofolder);

export default router;
