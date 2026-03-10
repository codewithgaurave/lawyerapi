import express from "express";
import Lawyer from "../models/Lawyer.js";
import Service from "../models/Service.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const lawyers = await Lawyer.find({ isActive: true });
    const lawyersWithServices = await Promise.all(
      lawyers.map(async (lawyer) => {
        const services = await Service.find({ lawyer_id: lawyer._id });
        return { ...lawyer.toObject(), services };
      })
    );
    return res.json({ lawyers: lawyersWithServices });
  } catch (err) {
    console.error("getAllPublicLawyers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ _id: req.params.id, isActive: true });
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    
    const services = await Service.find({ lawyer_id: lawyer._id });
    return res.json({ lawyer: { ...lawyer.toObject(), services } });
  } catch (err) {
    console.error("getPublicLawyerById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
