import express from "express";
import { addEducation, getMyEducation, updateEducation, deleteEducation } from "../controllers/educationController.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import Education from "../models/Education.js";

const router = express.Router();

// Lawyer routes
router.post("/", authenticateLawyer, addEducation);
router.get("/my-education", authenticateLawyer, getMyEducation);
router.put("/:id", authenticateLawyer, updateEducation);
router.delete("/:id", authenticateLawyer, deleteEducation);

// Admin routes - manage any lawyer's education
router.get("/admin/lawyer/:lawyerId", authenticateAdmin, async (req, res) => {
  const education = await Education.find({ lawyer_id: req.params.lawyerId }).sort({ end_date: -1 });
  res.json({ education });
});
router.post("/admin/lawyer/:lawyerId", authenticateAdmin, async (req, res) => {
  const { degree, field_of_study, school_name, start_date, end_date } = req.body;
  if (!degree || !field_of_study || !school_name || !start_date || !end_date)
    return res.status(400).json({ message: "degree, field_of_study, school_name, start_date, end_date required" });
  const education = await Education.create({ lawyer_id: req.params.lawyerId, ...req.body });
  res.status(201).json({ message: "Education added", education });
});
router.put("/admin/:id", authenticateAdmin, async (req, res) => {
  const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!education) return res.status(404).json({ message: "Education not found" });
  res.json({ message: "Education updated", education });
});
router.delete("/admin/:id", authenticateAdmin, async (req, res) => {
  const education = await Education.findByIdAndDelete(req.params.id);
  if (!education) return res.status(404).json({ message: "Education not found" });
  res.json({ message: "Education deleted" });
});

export default router;
