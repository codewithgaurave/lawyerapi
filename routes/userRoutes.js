import express from "express";
import { sendOTP, verifyOTP, getProfile, updateProfile, getAllUsers, updateUserByAdmin, deleteUser, toggleUserStatus } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/userAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);

router.get("/admin/all", authenticateAdmin, getAllUsers);
router.put("/admin/:id", authenticateAdmin, updateUserByAdmin);
router.delete("/admin/:id", authenticateAdmin, deleteUser);
router.patch("/admin/:id/status", authenticateAdmin, toggleUserStatus);

export default router;
