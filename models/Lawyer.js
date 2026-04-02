import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    // Registration Type
    registration_type: { type: String, enum: ["Individual", "Firm", "Association"], required: true },
    
    // Basic Info
    full_name: { type: String, required: true },
    mobile_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+@gmail\.com$/ },
    password: { type: String, required: true, select: false },
    
    // Bar Council Details
    bar_council_number: { type: String, required: true, unique: true },
    bar_council_state: { type: String, required: true },
    
    // For Firm/Association
    firm_name: { type: String },
    firm_registration_number: { type: String },
    firm_email: { type: String, match: /.+@gmail\.com$/ },
    
    // Experience & Specialization
    years_of_experience: { type: Number, required: true },
    specialization: { type: String, required: true },
    classification: { type: String, required: true },
    sub_classification: { type: String },
    
    // Office Details
    office_address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    office_latitude: { type: Number },
    office_longitude: { type: Number },

    // Documents
    bar_enrollment_date: { type: Date },
    court_practice: { type: String },
    law_degree: { type: String },
    university_name: { type: String },
    graduation_year: { type: Number },
    license_document: { type: String },
    bar_council_certificate: { type: String },

    // Profile Info
    about_lawyer: { type: String },
    languages_spoken: [{ type: String }],
    consultation_fee: { type: Number },
    availability_time: { type: String },

    // Social Links
    linkedin_url: { type: String },
    website_url: { type: String },

    // Status
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("Lawyer", lawyerSchema);
