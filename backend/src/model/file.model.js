import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    nameByuser: {
      type: String,
      lowercase: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    filepath: {
      type: String,
    },
    filename: {
      type: String,
    },
    Mimetype: {
      type: String,
    },
    inFolder: {
      type: Boolean,
      default: false,
    },
    filepathInfolder: {
      type: String,
    },
    allowtoview: {
      type: Boolean,
      default: false,
    },
    inlocked: {
      type: Boolean,
      default: false,
    },
    lockedfolderid: {
      type: Schema.Types.ObjectId,
      ref: "Lockedfolder",
    },
  },
  { timestamps: true },
);

const File = mongoose.model("File", fileSchema);

export default File;
