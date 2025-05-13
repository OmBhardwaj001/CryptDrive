import mongoose, { Schema, Types } from "mongoose";

const folderSchema = new Schema(
  {
    nameByuser: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filesinit: {
      type: Array,
    },
  },
  { timestamps: true },
);

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
