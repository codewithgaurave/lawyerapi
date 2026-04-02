import express from "express";
import { addCertificate, getMyCertificates, updateCertificate, deleteCertificate } from "../controllers/certificateController.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { uploadCertificateImage } from "../config/cloudinary.js";
import Certificate from "../models/Certificate.js";

const router = express.Router();

// Lawyer routes
router.post("/", authenticateLawyer, uploadCertificateImage, addCertificate);
router.get("/my-certificates", authenticateLawyer, getMyCertificates);
router.put("/:id", authenticateLawyer, uploadCertificateImage, updateCertificate);
router.delete("/:id", authenticateLawyer, deleteCertificate);

// Admin routes - manage any lawyer's certificates
router.get("/admin/lawyer/:lawyerId", authenticateAdmin, async (req, res) => {
  const certificates = await Certificate.find({ lawyer_id: req.params.lawyerId }).sort({ issue_date: -1 });
  res.json({ certificates });
});
router.post("/admin/lawyer/:lawyerId", authenticateAdmin, uploadCertificateImage, async (req, res) => {
  const { certificate_name, issuing_organization, issue_date } = req.body;
  if (!certificate_name || !issuing_organization || !issue_date)
    return res.status(400).json({ message: "certificate_name, issuing_organization, issue_date required" });
  const certificate = await Certificate.create({
    lawyer_id: req.params.lawyerId,
    ...req.body,
    certificate_file: req.file ? req.file.path : undefined,
  });
  res.status(201).json({ message: "Certificate added", certificate });
});
router.put("/admin/:id", authenticateAdmin, uploadCertificateImage, async (req, res) => {
  const update = { ...req.body };
  if (req.file) update.certificate_file = req.file.path;
  const certificate = await Certificate.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!certificate) return res.status(404).json({ message: "Certificate not found" });
  res.json({ message: "Certificate updated", certificate });
});
router.delete("/admin/:id", authenticateAdmin, async (req, res) => {
  const certificate = await Certificate.findByIdAndDelete(req.params.id);
  if (!certificate) return res.status(404).json({ message: "Certificate not found" });
  res.json({ message: "Certificate deleted" });
});

export default router;
