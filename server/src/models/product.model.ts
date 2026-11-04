import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    images: { type: [String], default: [] },
    title: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["متوفر", "غير متوفر"],
      default: "متوفر",
    },
    description: { type: String, default: "" },
    unit: { type: String, required: true },
    rating: { type: [ratingSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
