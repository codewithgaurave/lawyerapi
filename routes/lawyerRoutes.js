import express from "express";
import { registerLawyer, loginLawyer, getProfile, updateProfile, getAllLawyers, updateLawyerByAdmin, deleteLawyer, toggleLawyerStatus, getPublicLawyers, getPublicLawyerById, searchLawyers } from "../controllers/lawyerController.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", registerLawyer);
router.post("/login", loginLawyer);

// Public routes - no auth required
router.get("/public", getPublicLawyers);
router.get("/public/:id", getPublicLawyerById);
router.get("/search", searchLawyers);

router.get("/profile", authenticateLawyer, getProfile);
router.put("/profile", authenticateLawyer, updateProfile);
router.put("/fcm-token", authenticateLawyer, async (req, res) => {
  try {
    const { fcm_token } = req.body;
    if (!fcm_token) return res.status(400).json({ message: "FCM token required" });
    const Lawyer = (await import("../models/Lawyer.js")).default;
    await Lawyer.findByIdAndUpdate(req.lawyer.id, { fcm_token });
    return res.json({ message: "FCM token updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", authenticateAdmin, getAllLawyers);
router.put("/:id", authenticateAdmin, updateLawyerByAdmin);
router.delete("/:id", authenticateAdmin, deleteLawyer);
router.patch("/:id/status", authenticateAdmin, toggleLawyerStatus)

export default router;
