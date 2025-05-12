import { Router } from "express";
import {
  createfolder,
  addfilesTofolder,
  unlockfolder,
  viewfiles,
  lock,
} from "../controller/locked.folder.js";
import { Isloggedin } from "../middlewares/auth.middleware.js";
import { validatelockedfolder } from "../middlewares/validate.middleware.js";

const router = Router();

router
  .route("/createfolder")
  .post(Isloggedin, validatelockedfolder, createfolder);
router.route("/addfiles/:foldername").post(Isloggedin, addfilesTofolder);
router.route("/unlock").post(unlockfolder);
router.route("/view/:folderid").get(viewfiles);
router.route("/lock").post(lock);

export default router;
