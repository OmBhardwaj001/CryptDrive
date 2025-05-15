import { Router } from "express";
import {
  createFolder,
  addfileTofolder,
  unlockfolder,
  viewfiles,
  lock,
} from "../controller/folder.controller.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createfolder").post(Isloggedin, createFolder);
router.route("/addfiletofolder/:foldername").post(Isloggedin, addfileTofolder);
router.route("/unlock").post(unlockfolder);
router.route("/view").get(viewfiles);
router.route("/lock").post(lock);

export default router;
