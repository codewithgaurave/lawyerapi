import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    degree: { type: String, required: true },
    field_of_study: { type: String, required: true },
    school_name: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    grade: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Education", educationSchema);
