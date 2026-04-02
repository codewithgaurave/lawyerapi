import Experience from "../models/Experience.js";

export const addExperience = async (req, res) => {
  try {
    const { job_title, company_name, location, start_date, end_date, is_current, description } = req.body;

    if (!job_title || !company_name || !start_date) {
      return res.status(400).json({ message: "Job title, company name, and start date are required" });
    }

    const experience = await Experience.create({
      lawyer_id: req.lawyer.id,
      job_title,
      company_name,
      location,
      start_date,
      end_date,
      is_current,
      description,
    });

    return res.status(201).json({ message: "Experience added successfully", experience });
  } catch (err) {
    console.error("addExperience error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ lawyer_id: req.lawyer.id }).sort({ start_date: -1 });
    return res.json({ experiences });
  } catch (err) {
    console.error("getMyExperiences error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndUpdate(
      { _id: req.params.id, lawyer_id: req.lawyer.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!experience) return res.status(404).json({ message: "Experience not found" });
    return res.json({ message: "Experience updated successfully", experience });
  } catch (err) {
    console.error("updateExperience error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({ _id: req.params.id, lawyer_id: req.lawyer.id });
    if (!experience) return res.status(404).json({ message: "Experience not found" });
    return res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    console.error("deleteExperience error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
