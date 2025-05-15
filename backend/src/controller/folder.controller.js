import Folder from "../model/folder.model.js";
import File from "../model/file.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import bcrypt from "bcryptjs";

const createFolder = asyncHandler(async (req, res) => {
  const { nameByuser, isLocked, password } = req.body;

  if (!nameByuser) {
    throw new ApiError(400, "nameByuser not found");
  }

  const target = nameByuser;

  const isfound = await File.aggregate([
    {
      $match: { nameByuser: target },
    },
    {
      $unionWith: {
        coll: "folders",
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

  const folder = await Folder.create({
    nameByuser: nameByuser,
    createdBy: req.user._id,
    isLocked: isLocked,
    password: password,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "empty folder created by user"), folder);
});

const addfileTofolder = asyncHandler(async (req, res) => {
  const { filename, password } = req.body;
  const { foldername } = req.params;

  const [folder, file] = await Promise.all([
    Folder.findOne({ nameByuser: foldername }),
    File.findOne({ nameByuser: filename }),
  ]);

  if (!folder) {
    throw new ApiError(400, "folder not found");
  }

  if (!file) {
    throw new ApiError(400, "file not found");
  }

  if (file.inFolder) {
    throw new ApiError(400, "file is already in folder");
  }

  if (folder.isLocked) {
    if (!password) {
      throw new ApiError(401, "Password is required for locked folder");
    }

    const isMatch = await bcrypt.compare(password, folder.password);
    if (!isMatch) {
      throw new ApiError(403, "Incorrect password");
    }
  }

  if (!folder.filesinit.includes(filename)) {
    const result = await Folder.updateOne(
      { nameByuser: foldername },
      { $push: { filesinit: file._id } },
    );

    console.log(result);
  }

  await File.updateMany(
    { nameByuser: filename },
    { $set: { inFolder: true, folderid: folder._id, allowtoview: false } },
  );

  res.status(200).json(new ApiResponse(200, "file added to folder"));
});

const unlockfolder = asyncHandler(async (req, res) => {
  const { password, foldername } = req.body;

  if (!password) {
    throw new ApiError(400, "password not found");
  }

  const folder = await Folder.findOne({
    nameByuser: foldername,
    isLocked: true,
  });

  if (!folder) {
    throw new ApiError(400, "folder not found or already unlocked");
  }

  const isMatch = await bcrypt.compare(password, folder.password);

  if (!isMatch) {
    throw new ApiError(400, "password is incorrect");
  }

  await Folder.updateOne(
    { nameByuser: foldername },
    { $set: { isLocked: false } },
  );

  if (folder.filesinit.length > 0) {
    await File.updateMany(
      { folderid: folder._id },
      { $set: { allowtoview: true } },
    );
  }

  req.session.unlockfolders = req.session.unlockfolders || {};
  req.session.unlockfolders[folder._id] = {
    unlockedAt: Date.now(),
    expiresAt: Date.now() + 300000,
  };

  res.status(200).json(new ApiResponse(200, "folder in now open"));
});

const viewfiles = asyncHandler(async (req, res) => {
  const { folderid } = req.body;

  const folderSession = req.session.unlockfolders?.[folderid];
  if (!folderSession || Date.now() > folderSession.expiresAt) {
    delete req.session.unlockfolders?.[folderid];
    throw new ApiError(400, "session expired");
  }

  const files = await File.find(
    { folderid: folderid, allowtoview: true },
    { encryptedData: 0 },
  );

  if (files.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No files available to view", []));
  }

  res.status(200).json(new ApiResponse(200, "files are", files));
});

const lock = asyncHandler(async (req, res) => {
  const { folderid } = req.body;

  if (!folderid) {
    throw new ApiError(400, "Folder ID is required");
  }

  const folder = await Folder.findOneAndUpdate(
    { _id: folderid, isLocked: false },
    { $set: { isLocked: true } },
    { new: true },
  );

  if (!folder) {
    throw new ApiError(400, "folder not found or already locked");
  }

  if (req.session.unlockfolders) {
    delete req.session.unlockfolders[folderid];
  }

  res.status(200).json(new ApiResponse(200, "Folder locked successfully"));
});

export { createFolder, addfileTofolder, unlockfolder, viewfiles, lock };
