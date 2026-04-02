import express from "express";
import { addSkill, getMySkills, updateSkill, deleteSkill, endorseSkill } from "../controllers/skillController.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import Skill from "../models/Skill.js";

const router = express.Router();

// Lawyer routes
router.post("/", authenticateLawyer, addSkill);
router.get("/my-skills", authenticateLawyer, getMySkills);
router.put("/:id", authenticateLawyer, updateSkill);
router.delete("/:id", authenticateLawyer, deleteSkill);
router.patch("/:id/endorse", endorseSkill);

// Admin routes - manage any lawyer's skills
router.get("/admin/lawyer/:lawyerId", authenticateAdmin, async (req, res) => {
  const skills = await Skill.find({ lawyer_id: req.params.lawyerId }).sort({ createdAt: -1 });
  res.json({ skills });
});
router.post("/admin/lawyer/:lawyerId", authenticateAdmin, async (req, res) => {
  const { skill_name } = req.body;
  if (!skill_name) return res.status(400).json({ message: "skill_name required" });
  const skill = await Skill.create({
    lawyer_id: req.params.lawyerId,
    skill_name,
    proficiency_level: req.body.proficiency_level || "Intermediate",
  });
  res.status(201).json({ message: "Skill added", skill });
});
router.put("/admin/:id", authenticateAdmin, async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!skill) return res.status(404).json({ message: "Skill not found" });
  res.json({ message: "Skill updated", skill });
});
router.delete("/admin/:id", authenticateAdmin, async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return res.status(404).json({ message: "Skill not found" });
  res.json({ message: "Skill deleted" });
});

export default router;
