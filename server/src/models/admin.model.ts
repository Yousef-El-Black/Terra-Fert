import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    superAdmin: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);
