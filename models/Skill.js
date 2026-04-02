import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    skill_name: { type: String, required: true },
    proficiency_level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"], default: "Intermediate" },
    endorsements: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
