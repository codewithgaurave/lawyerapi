import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Lawyer from "../models/Lawyer.js";
import Service from "../models/Service.js";
import Experience from "../models/Experience.js";
import Certificate from "../models/Certificate.js";
import Education from "../models/Education.js";
import Skill from "../models/Skill.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

const signJwt = (lawyer) =>
  jwt.sign(
    { sub: String(lawyer._id), mobile: lawyer.mobile_number, tv: lawyer.tokenVersion },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

export const registerLawyer = async (req, res) => {
  try {
    const {
      registration_type,
      full_name,
      mobile_number,
      email,
      password,
      bar_council_number,
      bar_council_state,
      years_of_experience,
      specialization,
      classification,
      sub_classification,
      office_address,
      city,
      state,
      pincode,
      firm_name,
      firm_registration_number,
      firm_email,
    } = req.body;

    // Validate registration type
    if (!["Individual", "Firm", "Association"].includes(registration_type)) {
      return res.status(400).json({ message: "Invalid registration type. Must be Individual, Firm, or Association" });
    }

    // Validate Gmail requirement
    if (!email || !email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Gmail email is required" });
    }

    if (registration_type !== "Individual" && firm_email && !firm_email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Firm email must also be Gmail" });
    }

    // Validate required fields
    if (!full_name || !mobile_number || !password || !bar_council_number || !bar_council_state || !years_of_experience || !specialization || !classification || !office_address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate firm details for Firm/Association
    if (registration_type !== "Individual" && (!firm_name || !firm_registration_number)) {
      return res.status(400).json({ message: "Firm name and registration number required for Firm/Association" });
    }

    if (classification === "Civil" && !sub_classification) {
      return res.status(400).json({ message: "Sub classification is required for Civil classification" });
    }

    // Check for duplicates
    const exists = await Lawyer.findOne({
      $or: [{ mobile_number }, { email }, { bar_council_number }],
    });

    if (exists) {
      return res.status(409).json({ message: "Lawyer already exists with this mobile, email or bar council number" });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const lawyer = await Lawyer.create({
      registration_type,
      full_name,
      mobile_number,
      email,
      password: hash,
      bar_council_number,
      bar_council_state,
      years_of_experience,
      specialization,
      classification,
      sub_classification,
      office_address,
      city,
      state,
      pincode,
      firm_name: registration_type !== "Individual" ? firm_name : undefined,
      firm_registration_number: registration_type !== "Individual" ? firm_registration_number : undefined,
      firm_email: registration_type !== "Individual" ? firm_email : undefined,
    });

    return res.status(201).json({
      message: "Lawyer registered successfully",
      lawyer: {
        id: lawyer._id,
        full_name: lawyer.full_name,
        mobile_number: lawyer.mobile_number,
        email: lawyer.email,
        registration_type: lawyer.registration_type,
      },
    });
  } catch (err) {
    console.error("registerLawyer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginLawyer = async (req, res) => {
  try {
    const { mobile_number, password } = req.body;

    if (!mobile_number || !password) {
      return res.status(400).json({ message: "Mobile number and password are required" });
    }

    const lawyer = await Lawyer.findOne({ mobile_number }).select("+password +tokenVersion");
    if (!lawyer) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, lawyer.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signJwt(lawyer);

    return res.json({
      message: "Login successful",
      lawyer: {
        id: lawyer._id,
        full_name: lawyer.full_name,
        mobile_number: lawyer.mobile_number,
        email: lawyer.email,
        registration_type: lawyer.registration_type,
      },
      token,
    });
  } catch (err) {
    console.error("loginLawyer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.lawyer.id);
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    
    const experiences = await Experience.find({ lawyer_id: lawyer._id });
    const certificates = await Certificate.find({ lawyer_id: lawyer._id });
    const education = await Education.find({ lawyer_id: lawyer._id });
    const skills = await Skill.find({ lawyer_id: lawyer._id });
    const services = await Service.find({ lawyer_id: lawyer._id });

    return res.json({
      lawyer: lawyer.toObject(),
      experiences,
      certificates,
      education,
      skills,
      services,
    });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(req.lawyer.id, req.body, { new: true, runValidators: true });
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    return res.json({ message: "Profile updated successfully", lawyer });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    return res.json({ lawyers });
  } catch (err) {
    console.error("getAllLawyers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateLawyerByAdmin = async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    return res.json({ message: "Lawyer updated successfully", lawyer });
  } catch (err) {
    console.error("updateLawyerByAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteLawyer = async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndDelete(req.params.id);
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    return res.json({ message: "Lawyer deleted successfully" });
  } catch (err) {
    console.error("deleteLawyer error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleLawyerStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    return res.json({ message: `Lawyer ${isActive ? "activated" : "deactivated"} successfully`, lawyer });
  } catch (err) {
    console.error("toggleLawyerStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const searchLawyers = async (req, res) => {
  try {
    const { search, ...filters } = req.query;
    let query = { isActive: true };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const searchableFields = [
        "full_name",
        "email",
        "mobile_number",
        "bar_council_number",
        "bar_council_state",
        "specialization",
        "classification",
        "sub_classification",
        "office_address",
        "city",
        "state",
        "pincode",
        "about_lawyer",
        "court_practice",
        "law_degree",
        "university_name",
        "languages_spoken",
        "firm_name",
      ];
      query.$or = searchableFields.map((field) => ({ [field]: searchRegex }));

      if (!isNaN(search)) {
        const num = Number(search);
        query.$or.push(
          { years_of_experience: num },
          { consultation_fee: num },
          { graduation_year: num }
        );
      }
    }

    const schemaPaths = Object.keys(Lawyer.schema.paths);
    Object.keys(filters).forEach((key) => {
      if (schemaPaths.includes(key) && filters[key]) {
        const fieldType = Lawyer.schema.paths[key].instance;
        if (fieldType === "String") {
          query[key] = { $regex: filters[key], $options: "i" };
        } else if (fieldType === "Number") {
          query[key] = Number(filters[key]);
        } else if (fieldType === "Boolean") {
          query[key] = filters[key] === "true";
        } else if (fieldType === "Array") {
          query[key] = { $in: [new RegExp(filters[key], "i")] };
        } else {
          query[key] = filters[key];
        }
      }
    });

    const lawyers = await Lawyer.find(query);

    const lawyersWithServices = await Promise.all(
      lawyers.map(async (lawyer) => {
        const services = await Service.find({ lawyer_id: lawyer._id });
        return { ...lawyer.toObject(), services };
      })
    );

    return res.json({
      success: true,
      count: lawyersWithServices.length,
      lawyers: lawyersWithServices,
    });
  } catch (err) {
    console.error("searchLawyers error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
