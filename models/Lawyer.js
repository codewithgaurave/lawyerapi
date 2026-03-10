import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    mobile_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    bar_council_number: { type: String, required: true, unique: true },
    bar_council_state: { type: String, required: true },
    years_of_experience: { type: Number, required: true },
    specialization: { type: String, required: true },
    classification: { type: String, required: true },
    sub_classification: { type: String },
    office_address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    bar_enrollment_date: { type: Date },
    court_practice: { type: String },
    law_degree: { type: String },
    university_name: { type: String },
    graduation_year: { type: Number },
    license_document: { type: String },
    bar_council_certificate: { type: String },

    about_lawyer: { type: String },
    languages_spoken: [{ type: String }],
    consultation_fee: { type: Number },
    availability_time: { type: String },
    office_latitude: { type: Number },
    office_longitude: { type: Number },

    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lawyer", lawyerSchema);
