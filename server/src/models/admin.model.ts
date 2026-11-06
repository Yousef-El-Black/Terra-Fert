import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    superAdmin: { type: Boolean, required: true },
    initialSuperAdmin: { type: Boolean, select: false },
  },
  { timestamps: true },
);

adminSchema.index(
  { initialSuperAdmin: 1 },
  { unique: true, sparse: true },
);

export default mongoose.model("Admin", adminSchema);
