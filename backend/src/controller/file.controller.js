import File from "../model/file.model.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import encryptfile from "../utils/encryption.js";
import uploadEncryptedBuffer from "../service/cloudinary.js";
import decryptfile from "../utils/decryption.js";
import Folder from "../model/folder.model.js";
import bcrypt from "bcryptjs";

const uploadfile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, "file not found");
  }

  const { nameByuser, description } = req.body;
  const { originalname, size, mimetype } = req.file;

  const maxFileSize = 5 * 1000 * 1000;
  const allowedMIMEtypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "video/mp4",
    "video/quicktime",
    "audio/mpeg",
    "audio/wav",
  ];

  if (!allowedMIMEtypes.includes(mimetype)) {
    throw new ApiError(400, "mimetype not matched");
  }

  if (size > maxFileSize) {
    throw new ApiError(400, "file size exceeds max size allowed");
  }

  const originalfile = req.file.buffer;
  const originalEncrypted = encryptfile(originalfile);

  const result = await uploadEncryptedBuffer(
    originalEncrypted,
    `${req.file.originalname}${Date.now()}`,
  );
  console.log("file uploaded successfully to cloud");

  const resultURL = result.secure_url;

  const file = await File.create({
    nameByuser: nameByuser || originalname, // if user has given name then use that for originalname for file and filename with datetime would be different
    size,
    createdBy: req.user._id,
    description: description,
    filepath: resultURL,
    Mimetype: mimetype,
    encryptedData: originalEncrypted,
  });

  // await file.save();

  res
    .status(200)
    .json(new ApiResponse(200, "file uploaded successfully"), file);
});

const getfile = asyncHandler(async (req, res, next) => {
  const { filetype } = req.body;
  const { _id } = req.user;

  const files = await File.find(
    {
      createdBy: _id,
      Mimetype: filetype,
    },
    { nameByuser: 1 },
  );

  if (files.length === 0) {
    throw new ApiError(400, "files not found");
  }

  res.status(200).json(new ApiResponse(200, "your files are here:", files));
});

const filepreview = asyncHandler(async (req, res, next) => {
  const { filename } = req.params;

  const fileobj = await File.findOne(
    {
      nameByuser: filename,
    },
    { filepath: 1, encryptedData: 1 },
  );

  if (!fileobj.allowtoview) {
    throw new ApiError(400, "file is inside a locked folder");
  }

  const filepath = fileobj.filepath;
  const encryptedData = fileobj.encryptedData;

  const decryptedData = decryptfile(encryptedData);
  // fs.writeFileSync("decrypted.pdf", decryptedData);

  //  res.setHeader('Content-Type', 'application/pdf'); // or 'image/png', etc.
  //  res.setHeader('Content-Disposition', 'inline'); // 'inline' = show in browser, not download
  //  res.send(decryptedData);

  res.status(200).json(new ApiResponse(200, "file preview", decryptedData));
});

const removefilefromfolder = asyncHandler(async (req, res) => {
  const { namebyuser } = req.params;
  const { password } = req.body;

  const file = await File.findOne({ nameByuser: namebyuser });

  if (!file) {
    throw new ApiError(400, "file not found");
  }

  const folderid = file.folderid;

  const folder = await Folder.findOne({ _id: folderid });

  if (!folder) {
    throw new ApiError(400, "folder not found");
  }

  if (folder.isLocked) {
    if (!password) {
      throw new ApiError(400, "password is required for locked folders");
    }
  }

  const isMatch = await bcrypt.compare(password, folder.password);
  if (!isMatch) {
    throw new ApiError(400, "password incorrect");
  }

  await Folder.updateOne(
    { _id: folderid },
    {
      $set: { folderid: null },
      $pull: { filesinit: file._id },
    },
  );

  await File.updateOne(
    { nameByuser: namebyuser },
    { $set: { inFolder: false, filepathInfolder: null, folderid: null } },
  );

  if (!file) {
    throw new ApiError(400, "file not found");
  }

  res.status(200).json(new ApiResponse(200, "file removed from folder"));
});

const download = asyncHandler(async (req, res) => {
  const { namebyuser } = req.params;

  const file = await File.findOne({
    nameByuser: namebyuser,
  });

  if (!file) {
    throw new ApiError(400, "file not found");
  }

  if (!file.allowtoview) {
    throw new ApiError(400, "file is inside a locked folder");
  }

  const encryptedData = file.encryptedData;

  const decryptedData = decryptfile(encryptedData);

  res
    .status(200)
    .json(new ApiResponse(200, "here is your file", decryptedData));
});

export { uploadfile, getfile, filepreview, removefilefromfolder, download };
