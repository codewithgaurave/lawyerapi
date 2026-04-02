import Education from "../models/Education.js";

export const addEducation = async (req, res) => {
  try {
    const { degree, field_of_study, school_name, start_date, end_date, grade, description } = req.body;

    if (!degree || !field_of_study || !school_name || !start_date || !end_date) {
      return res.status(400).json({ message: "Degree, field of study, school name, start date, and end date are required" });
    }

    const education = await Education.create({
      lawyer_id: req.lawyer.id,
      degree,
      field_of_study,
      school_name,
      start_date,
      end_date,
      grade,
      description,
    });

    return res.status(201).json({ message: "Education added successfully", education });
  } catch (err) {
    console.error("addEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyEducation = async (req, res) => {
  try {
    const education = await Education.find({ lawyer_id: req.lawyer.id }).sort({ end_date: -1 });
    return res.json({ education });
  } catch (err) {
    console.error("getMyEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndUpdate(
      { _id: req.params.id, lawyer_id: req.lawyer.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) return res.status(404).json({ message: "Education not found" });
    return res.json({ message: "Education updated successfully", education });
  } catch (err) {
    console.error("updateEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndDelete({ _id: req.params.id, lawyer_id: req.lawyer.id });
    if (!education) return res.status(404).json({ message: "Education not found" });
    return res.json({ message: "Education deleted successfully" });
  } catch (err) {
    console.error("deleteEducation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
