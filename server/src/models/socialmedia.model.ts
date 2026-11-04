import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("SocialMedia", socialMediaSchema);
