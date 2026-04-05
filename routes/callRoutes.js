import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";
import {
  initiateCall,
  getAgoraToken,
  acceptCall,
  rejectCall,
  endCall,
  getCallHistory,
  getCallDetails,
  updateCallStatus,
} from "../controllers/callController.js";
import { authenticateUser } from "../middleware/userAuth.js";
import { authenticateLawyer } from "../middleware/lawyerAuth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate either user or lawyer
const authenticateUserOrLawyer = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, JWT_SECRET);

    // Try User first
    const user = await User.findById(decoded.sub);
    if (user) {
      req.user = { id: user._id.toString(), mobile: user.mobile_number, name: user.name };
      return next();
    }

    // Try Lawyer
    const lawyer = await Lawyer.findById(decoded.sub).select("+tokenVersion");
    if (lawyer) {
      if (decoded.tv !== undefined && lawyer.tokenVersion !== decoded.tv) {
        return res.status(401).json({ message: "Token expired" });
      }
      req.lawyer = { id: lawyer._id.toString(), mobile: lawyer.mobile_number, name: lawyer.full_name };
      return next();
    }

    return res.status(401).json({ message: "Invalid token" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Call endpoints
router.post("/initiate", authenticateUserOrLawyer, initiateCall);
router.post("/token", authenticateUserOrLawyer, getAgoraToken);
router.post("/accept", authenticateUserOrLawyer, acceptCall);
router.post("/reject", authenticateUserOrLawyer, rejectCall);
router.post("/end", authenticateUserOrLawyer, endCall);
router.post("/status", authenticateUserOrLawyer, updateCallStatus);
router.get("/history", authenticateUserOrLawyer, getCallHistory);
router.get("/:call_id", authenticateUserOrLawyer, getCallDetails);

export default router;
