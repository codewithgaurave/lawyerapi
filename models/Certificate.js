import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    certificate_name: { type: String, required: true },
    issuing_organization: { type: String, required: true },
    issue_date: { type: Date, required: true },
    expiry_date: { type: Date },
    credential_id: { type: String },
    credential_url: { type: String },
    certificate_file: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
