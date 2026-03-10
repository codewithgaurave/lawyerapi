import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    service_name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    duration: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
