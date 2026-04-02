import Skill from "../models/Skill.js";

export const addSkill = async (req, res) => {
  try {
    const { skill_name, proficiency_level } = req.body;

    if (!skill_name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const skill = await Skill.create({
      lawyer_id: req.lawyer.id,
      skill_name,
      proficiency_level: proficiency_level || "Intermediate",
    });

    return res.status(201).json({ message: "Skill added successfully", skill });
  } catch (err) {
    console.error("addSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ lawyer_id: req.lawyer.id }).sort({ createdAt: -1 });
    return res.json({ skills });
  } catch (err) {
    console.error("getMySkills error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, lawyer_id: req.lawyer.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) return res.status(404).json({ message: "Skill not found" });
    return res.json({ message: "Skill updated successfully", skill });
  } catch (err) {
    console.error("updateSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, lawyer_id: req.lawyer.id });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    return res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error("deleteSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const endorseSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    
    skill.endorsements += 1;
    await skill.save();
    
    return res.json({ message: "Skill endorsed successfully", skill });
  } catch (err) {
    console.error("endorseSkill error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
