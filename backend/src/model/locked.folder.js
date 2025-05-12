import mongoose, { Schema } from "mongoose";

const lockedfolderSchema = new Schema(
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
    folderpath: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

const Lockedfolder = mongoose.model("Lockedfolder", lockedfolderSchema);

export default Lockedfolder;
