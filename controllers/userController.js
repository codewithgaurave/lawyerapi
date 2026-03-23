import jwt from "jsonwebtoken";
import User from "../models/User.js";
import http from "http";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS API
const sendOTPViaSMS = async (mobileNumber, otp) => {
  return new Promise((resolve) => {
    try {
      const smsUser = process.env.SMS_USER || "hucsbj";
      const smsPassword = process.env.SMS_PASSWORD || "hucsbj123";
      const senderId = process.env.SMS_SENDER_ID || "HUCSBJ";

      // Format mobile number with country code if needed
      const formattedNumber = mobileNumber.startsWith("91") ? mobileNumber : `91${mobileNumber}`;

      const message = `${otp} is your OTP for login request on HUCS. Valid for 2 mins. Never Share OTP HUCSBJ`;

      // Build URL with proper encoding
      const url = `http://smsanoviq.com/api/mt/SendSMS?user=${smsUser}&password=${smsPassword}&senderid=${senderId}&channel=Trans&DCS=0&flashsms=0&number=${formattedNumber}&text=${encodeURIComponent(message)}&route=02&peid=1701173890459387808&DLTTemplateId=1707175973383231576`;

      console.log("\n📱 Sending OTP via SMS...");
      console.log("Mobile:", formattedNumber);
      console.log("OTP:", otp);

      // Use http.get with timeout
      const req = http.get(url, { timeout: 5000 }, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          console.log("✅ SMS API Response Status:", res.statusCode);
          console.log("✅ SMS API Response:", data);
          resolve({ success: true, statusCode: res.statusCode, data: data });
        });
      });

      req.on("error", (error) => {
        console.error("❌ SMS API Error:", error.message);
        resolve({ success: false, message: error.message });
      });

      req.on("timeout", () => {
        console.log("⚠️ Request timeout");
        req.destroy();
        resolve({ success: false, message: "Request timeout" });
      });

    } catch (error) {
      console.error("❌ SMS API Error:", error.message);
      resolve({ success: false, message: error.message });
    }
  });
};

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

    // Generate random OTP
    const otp = generateOTP();
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    let user = await User.findOne({ mobile_number });
    
    if (user) {
      user.otp = otp;
      user.otp_expiry = otp_expiry;
      await user.save();
    } else {
      user = await User.create({
        mobile_number,
        otp,
        otp_expiry,
      });
    }

    // Print OTP to console
    console.log("\n");
    console.log("╔════════════════════════════════════════╗");
    console.log("║         📱 OTP GENERATED               ║");
    console.log("╠════════════════════════════════════════╣");
    console.log(`║ Mobile: ${mobile_number.padEnd(32)} ║`);
    console.log(`║ OTP: ${otp.padEnd(35)} ║`);
    console.log(`║ Expires: 10 minutes                    ║`);
    console.log("╚════════════════════════════════════════╝");
    console.log("\n");

    // Send OTP via SMS
    const smsResult = await sendOTPViaSMS(mobile_number, otp);

    return res.json({
      message: "OTP generated and sent successfully",
      otp: otp,
      mobile_number,
      status: "OTP sent via SMS",
      expiresIn: "10 minutes",
      smsResponse: smsResult
    });
  } catch (err) {
    console.error("sendOTP error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { mobile_number, otp, name } = req.body;

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

    // Update user name if provided
    if (name) {
      user.name = name;
    }

    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();

    const token = signJwt(user);

    console.log("\n");
    console.log("╔════════════════════════════════════════╗");
    console.log("║         ✅ USER LOGGED IN              ║");
    console.log("╠════════════════════════════════════════╣");
    console.log(`║ Mobile: ${mobile_number.padEnd(32)} ║`);
    console.log(`║ Name: ${(name || "N/A").padEnd(35)} ║`);
    console.log("║ Token: Generated ✅                    ║");
    console.log("╚════════════════════════════════════════╝");
    console.log("\n");

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
    return res.status(500).json({ message: "Server error", error: err.message });
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
