import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

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
    filesinit: [
      {
        type: String,
      },
    ],
    password: {
      type: String,
    },
    isLocked: {
      type: String,
      default: false,
    },
  },

  { timestamps: true },
);

folderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
