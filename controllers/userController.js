import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const FIXED_OTP = "123456";

const signJwt = (user) =>
  jwt.sign(
    { sub: String(user._id), mobile: user.mobile_number },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

export const sendOTP = async (req, res) => {
  try {
    const { mobile_number } = req.body;

    if (!mobile_number) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ mobile_number });
    
    if (user) {
      user.otp = FIXED_OTP;
      user.otp_expiry = otp_expiry;
      await user.save();
    } else {
      user = await User.create({
        mobile_number,
        otp: FIXED_OTP,
        otp_expiry,
      });
    }

    return res.json({
      message: "OTP sent successfully",
      otp: FIXED_OTP,
      mobile_number,
    });
  } catch (err) {
    console.error("sendOTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { mobile_number, otp } = req.body;

    if (!mobile_number || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    const user = await User.findOne({ mobile_number }).select("+otp +otp_expiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otp_expiry) {
      return res.status(401).json({ message: "OTP expired" });
    }

    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();

    const token = signJwt(user);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        mobile_number: user.mobile_number,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("verifyOTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ users });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("updateUserByAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: `User ${isActive ? "activated" : "deactivated"} successfully`, user });
  } catch (err) {
    console.error("toggleUserStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
