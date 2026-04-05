import jwt from "jsonwebtoken";
import Lawyer from "../models/Lawyer.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateLawyer = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const lawyer = await Lawyer.findById(decoded.sub).select("+tokenVersion");

    if (!lawyer) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check token version if present
    if (decoded.tv !== undefined && lawyer.tokenVersion !== decoded.tv) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.lawyer = { id: lawyer._id.toString(), mobile: lawyer.mobile_number, name: lawyer.full_name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
