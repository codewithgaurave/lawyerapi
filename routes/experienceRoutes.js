import express from "express";
import { addExperience, getMyExperiences, updateExperience, deleteExperience } from "../controllers/experienceController.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import Experience from "../models/Experience.js";

const router = express.Router();

// Lawyer routes
router.post("/", authenticateLawyer, addExperience);
router.get("/my-experiences", authenticateLawyer, getMyExperiences);
router.put("/:id", authenticateLawyer, updateExperience);
router.delete("/:id", authenticateLawyer, deleteExperience);

// Admin routes - manage any lawyer's experiences
router.get("/admin/lawyer/:lawyerId", authenticateAdmin, async (req, res) => {
  const experiences = await Experience.find({ lawyer_id: req.params.lawyerId }).sort({ start_date: -1 });
  res.json({ experiences });
});
router.post("/admin/lawyer/:lawyerId", authenticateAdmin, async (req, res) => {
  const { job_title, company_name, start_date } = req.body;
  if (!job_title || !company_name || !start_date)
    return res.status(400).json({ message: "job_title, company_name, start_date required" });
  const experience = await Experience.create({ lawyer_id: req.params.lawyerId, ...req.body });
  res.status(201).json({ message: "Experience added", experience });
});
router.put("/admin/:id", authenticateAdmin, async (req, res) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!experience) return res.status(404).json({ message: "Experience not found" });
  res.json({ message: "Experience updated", experience });
});
router.delete("/admin/:id", authenticateAdmin, async (req, res) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) return res.status(404).json({ message: "Experience not found" });
  res.json({ message: "Experience deleted" });
});

export default router;
