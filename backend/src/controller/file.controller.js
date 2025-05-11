import File from "../model/file.model.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import remove from "../utils/file.remove.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";

const uploadfile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(400, "file not found");
  }

  const { nameByuser, description } = req.body;
  const { originalname, size, path, mimetype, filename } = req.file;

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
    remove(path);
    throw new ApiError(400, "mimetype not matched");
  }

  if (size > maxFileSize) {
    remove(path);
    throw new ApiError(400, "file size exceeds max size allowed");
  }

  if (nameByuser) {
    req.file.filename = nameByuser;
  }

  const file = await File.create({
    nameByuser: nameByuser || originalname, // if user has given name then use that for originalname for file and filename with datetime would be different
    size,
    createdBy: req.user._id,
    description: description,
    filepath: path,
    filename: filename,
    Mimetype: mimetype,
  });

  if (!file) {
    remove(path);
    throw new ApiError(400, "file not uploaded");
  }

  await file.save();

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
    { filepath: 1 },
  );

  const filepath = fileobj.filepath;

  if (!filepath) {
    throw new ApiError(400, "filepath not found");
  }

  // res.sendFile(filepath);
  res.status(200).json(new ApiResponse(200, "file preview", filepath));
});

const removefilefromfolder = asyncHandler(async (req, res) => {
  const { namebyuser } = req.params;

  const file = await File.findOneAndUpdate(
    { nameByuser: namebyuser },
    { $set: { inFolder: false, filepathInfolder: null } },
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

  const filepath = file.filepath;

  res.download(filepath, (err) => {
    if (err) {
      console.log("error sending file:", err);
      throw new ApiError(400, "file cannot be downloaded");
    }
  });
});

export { uploadfile, getfile, filepreview, removefilefromfolder, download };
