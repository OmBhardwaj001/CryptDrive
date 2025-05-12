import Lockedfolder from "../model/locked.folder.js";
import User from "../model/user.model.js";
import File from "../model/file.model.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const createfolder = asyncHandler(async (req, res) => {
  const { nameByuser, password } = req.body;

  if (!nameByuser) {
    throw new ApiError(400, "name not found");
  }

  const target = nameByuser;

  const isfound = await File.aggregate([
    {
      $match: { nameByuser: target },
    },
    {
      $unionWith: {
        coll: "folder",
        pipeline: [
          {
            $match: { nameByuser: target },
          },
        ],
      },
    },
  ]);

  if (isfound.length != 0) {
    throw new ApiError(400, "this name already exists");
  }

  const lockedfolder = await Lockedfolder.create({
    nameByuser: nameByuser,
    createdBy: req.user._id,
    password: password,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "locked folder created successfully"),
      lockedfolder,
    );
});

const addfilesTofolder = asyncHandler(async (req, res) => {
  const { nameByuser } = req.body;
  const { foldername } = req.params;

  const path = "C:/Users/OM BHARDWAJ/Desktop/cryptdrive/backend/public/images/"; // forward slasesh or double slash will work not backward

  const lockedfolder = await Lockedfolder.findOne({ nameByuser: foldername });

  if (!lockedfolder) {
    throw new ApiError(404, "Target folder not found");
  }

  const folderpath = join(path, foldername); // folderpath -> images/foldername
  const filepath = join(path, foldername, nameByuser); // filename -> images/foldername/filename

  await Lockedfolder.updateOne(
    { nameByuser: foldername },
    { $set: { folderPath: folderpath } },
  );

  await File.updateMany(
    { filename: nameByuser },
    {
      $set: {
        filepathInfolder: filepath,
        inFolder: true,
        inlocked: true,
        lockedfolderid: lockedfolder._id,
      },
    },
  );

  res.status(200).json(new ApiResponse(200, "file added to folder"));
});

const unlockfolder = asyncHandler(async (req, res) => {
  const { password, nameByuser } = req.body;

  if (!password) {
    throw new ApiError(400, "password not found");
  }

  const lockedfolder = await Lockedfolder.findOneAndUpdate(
    { nameByuser: nameByuser },
    { $set: { islocked: false } },
  );

  if (password != lockedfolder.password) {
    throw new ApiError(400, "password incorrect");
  }

  await File.updateMany(
    { lockedfolderid: lockedfolder._id, allowtoview: false },
    { $set: { allowtoview: true } },
  );

  req.session.unlockfolders = req.session.unlockfolders || {};
  req.session.unlockfolders[lockedfolder._id] = {
    unlockedAt: Date.now(),
    expiresAt: Date.now() + process.env.LOCKED_FOLDER_SECRET_KEY,
  };

  res.status(200).json(new ApiResponse(200, "folder in now open"));
});

const viewfiles = asyncHandler(async (req, res) => {
  const { folderid } = req.params;

  const folderSession = req.session.unlockfolders?.[folderid];

  if (!folderSession || Date.now() > folderSession.expiresAt) {
    delete req.session.unlockfolders?.[folderid];
    throw new ApiError(400, "session expired");
  }

  const files = await File.find({
    lockedfolderid: folderid,
    allowtoview: true,
  });

  res.status(200).json(new ApiResponse(200, "Files retrieved", files));
});

const lock = asyncHandler(async (req, res) => {
  const { folderid } = req.body;

  if (!folderid) {
    throw new ApiError(400, "Folder ID is required");
  }

  if (req.session.unlockfolders) {
    delete req.session.unlockfolders[folderid];
  }

  res.status(200).json(new ApiResponse(200, "Folder locked successfully"));
});

export { createfolder, addfilesTofolder, unlockfolder, viewfiles, lock };
