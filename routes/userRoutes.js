import express from "express";
import { sendOTP, verifyOTP, getProfile, updateProfile, getAllUsers, updateUserByAdmin, deleteUser, toggleUserStatus } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/userAuth.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);
router.put("/fcm-token", authenticateUser, async (req, res) => {
  try {
    const { fcm_token } = req.body;
    if (!fcm_token) return res.status(400).json({ message: "FCM token required" });
    const User = (await import("../models/User.js")).default;
    await User.findByIdAndUpdate(req.user.id, { fcm_token });
    return res.json({ message: "FCM token updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/all", authenticateAdmin, getAllUsers);
router.put("/admin/:id", authenticateAdmin, updateUserByAdmin);
router.delete("/admin/:id", authenticateAdmin, deleteUser);
router.patch("/admin/:id/status", authenticateAdmin, toggleUserStatus);

export default router;
