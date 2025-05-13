import Folder from "../model/folder.model.js";
import File from "../model/file.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/Asynchandler.js";

const createFolder = asyncHandler(async (req, res) => {
  const { nameByuser } = req.body;

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
  });

  res
    .status(200)
    .json(new ApiResponse(200, "empty folder created by user"), folder);
});

const addfileTofolder = asyncHandler(async (req, res) => {
  const { nameByuser } = req.body;
  const { foldername } = req.params;

  await Folder.updateMany(
    { nameByuser: foldername },
    { $set: { filesinit: [nameByuser] } },
  );

  const file = await File.findOne({ nameByuser: nameByuser });

  if (file.inFolder) {
    throw new ApiError(400, "file is already in folder");
  }

  await File.updateMany(
    { nameByuser: nameByuser },
    { $set: { inFolder: true } },
  );

  res.status(200).json(new ApiResponse(200, "file added to folder"));
});

export { createFolder, addfileTofolder };
