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

router.get("/all", authenticateAdmin, getAllLawyers);
router.put("/:id", authenticateAdmin, updateLawyerByAdmin);
router.delete("/:id", authenticateAdmin, deleteLawyer);
router.patch("/:id/status", authenticateAdmin, toggleLawyerStatus)

export default router;
