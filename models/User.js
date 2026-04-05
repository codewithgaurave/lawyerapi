import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    mobile_number: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    otp: { type: String, select: false },
    otp_expiry: { type: Date, select: false },
    isActive: { type: Boolean, default: true },
    fcm_token: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
