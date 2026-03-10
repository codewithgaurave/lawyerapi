import express from "express";
import { registerLawyer, loginLawyer, getProfile, updateProfile, getAllLawyers, updateLawyerByAdmin, deleteLawyer, toggleLawyerStatus } from "../controllers/lawyerController.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", registerLawyer);
router.post("/login", loginLawyer);

router.get("/profile", authenticateLawyer, getProfile);
router.put("/profile", authenticateLawyer, updateProfile);

router.get("/all", authenticateAdmin, getAllLawyers);
router.put("/:id", authenticateAdmin, updateLawyerByAdmin);
router.delete("/:id", authenticateAdmin, deleteLawyer);
router.patch("/:id/status", authenticateAdmin, toggleLawyerStatus);

export default router;
