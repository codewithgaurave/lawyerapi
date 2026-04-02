import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    job_title: { type: String, required: true },
    company_name: { type: String, required: true },
    location: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    is_current: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
