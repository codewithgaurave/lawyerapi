import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: user._id.toString(), mobile: user.mobile_number, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
