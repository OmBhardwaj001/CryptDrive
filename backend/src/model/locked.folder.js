import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
    password: {
      type: String,
    },
    filesinit: {
      type: Array,
    },
  },
  { timestamps: true },
);

lockedfolderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Lockedfolder = mongoose.model("Lockedfolder", lockedfolderSchema);

export default Lockedfolder;
