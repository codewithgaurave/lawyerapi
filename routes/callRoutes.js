import express from "express";
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

// Middleware to authenticate either user or lawyer
const authenticateUserOrLawyer = (req, res, next) => {
  // Try user authentication first
  authenticateUser(req, res, (err) => {
    if (!err && req.user) {
      return next();
    }
    // If user auth fails, try lawyer authentication
    authenticateLawyer(req, res, next);
  });
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
