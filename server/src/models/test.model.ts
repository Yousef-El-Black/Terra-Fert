import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    images: { type: [String], default: [] },
    productId: { type: mongoose.Types.ObjectId },
    title: { type: String, required: true, default: "" },
    text: { type: String, required: true, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Test", testSchema);
