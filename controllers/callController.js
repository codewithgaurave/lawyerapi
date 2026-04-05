import agoraToken from "agora-token";
const { RtcTokenBuilder, RtcRole } = agoraToken;
import Call from "../models/Call.js";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";

// Agora credentials from .env
const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// Token expiration time (24 hours)
const TOKEN_EXPIRATION_TIME = 24 * 3600;

// Generate unique channel name
const generateChannelName = () => {
  return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate Agora RTC Token
const generateAgoraToken = (channelName, uid, role = 1) => {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    throw new Error("Agora credentials not configured");
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + TOKEN_EXPIRATION_TIME;

  const token = RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return token;
};

// Initiate Call
export const initiateCall = async (req, res) => {
  try {
    const { receiver_id, receiver_type, call_type } = req.body;
    const caller_id = req.user?.id || req.lawyer?.id;
    const caller_type = req.user ? "User" : "Lawyer";

    if (!receiver_id || !receiver_type) {
      return res.status(400).json({ message: "Receiver details required" });
    }

    // Verify receiver exists
    const ReceiverModel = receiver_type === "User" ? User : Lawyer;
    const receiver = await ReceiverModel.findById(receiver_id);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Generate unique channel name
    const channel_name = generateChannelName();

    // Generate UIDs for caller and receiver
    const caller_uid = Math.floor(Math.random() * 1000000);
    const receiver_uid = Math.floor(Math.random() * 1000000);

    // Generate tokens
    const caller_token = generateAgoraToken(channel_name, caller_uid);
    const receiver_token = generateAgoraToken(channel_name, receiver_uid);

    // Create call record
    const call = await Call.create({
      caller_id,
      caller_type,
      receiver_id,
      receiver_type,
      channel_name,
      call_type: call_type || "audio",
      status: "initiated",
      agora_uid_caller: caller_uid,
      agora_uid_receiver: receiver_uid,
    });

    console.log("\n📞 Call Initiated:");
    console.log(`Channel: ${channel_name}`);
    console.log(`Caller: ${caller_type} (${caller_id})`);
    console.log(`Receiver: ${receiver_type} (${receiver_id})`);

    // TODO: Send push notification to receiver
    // sendPushNotification(receiver_id, { call_id: call._id, channel_name });

    return res.status(201).json({
      message: "Call initiated successfully",
      call: {
        call_id: call._id,
        channel_name,
        call_type: call.call_type,
        status: call.status,
      },
      agora: {
        app_id: AGORA_APP_ID,
        channel_name,
        caller_token,
        caller_uid,
        receiver_token,
        receiver_uid,
      },
    });
  } catch (err) {
    console.error("initiateCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Agora Token (for joining existing call)
export const getAgoraToken = async (req, res) => {
  try {
    const { channel_name, uid } = req.body;

    if (!channel_name || !uid) {
      return res.status(400).json({ message: "Channel name and UID required" });
    }

    // Verify call exists
    const call = await Call.findOne({ channel_name });
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    // Generate token
    const token = generateAgoraToken(channel_name, uid);

    return res.json({
      message: "Token generated successfully",
      agora: {
        app_id: AGORA_APP_ID,
        channel_name,
        token,
        uid,
      },
    });
  } catch (err) {
    console.error("getAgoraToken error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Accept Call
export const acceptCall = async (req, res) => {
  try {
    const { call_id } = req.body;
    const receiver_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findById(call_id);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    if (call.receiver_id.toString() !== receiver_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (call.status !== "initiated" && call.status !== "ringing") {
      return res.status(400).json({ message: "Call cannot be accepted" });
    }

    call.status = "accepted";
    call.accepted_at = new Date();
    await call.save();

    console.log(`\n✅ Call Accepted: ${call_id}`);

    return res.json({
      message: "Call accepted successfully",
      call: {
        call_id: call._id,
        channel_name: call.channel_name,
        status: call.status,
      },
    });
  } catch (err) {
    console.error("acceptCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reject Call
export const rejectCall = async (req, res) => {
  try {
    const { call_id, reason } = req.body;
    const receiver_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findById(call_id);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    if (call.receiver_id.toString() !== receiver_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    call.status = "rejected";
    call.rejection_reason = reason || "User rejected";
    call.ended_at = new Date();
    await call.save();

    console.log(`\n❌ Call Rejected: ${call_id}`);

    return res.json({
      message: "Call rejected successfully",
      call: {
        call_id: call._id,
        status: call.status,
      },
    });
  } catch (err) {
    console.error("rejectCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// End Call
export const endCall = async (req, res) => {
  try {
    const { call_id, duration } = req.body;
    const user_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findById(call_id);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    // Verify user is part of the call
    if (
      call.caller_id.toString() !== user_id &&
      call.receiver_id.toString() !== user_id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    call.status = "ended";
    call.ended_at = new Date();
    call.duration = duration || 0;
    await call.save();

    console.log(`\n📴 Call Ended: ${call_id} (Duration: ${duration}s)`);

    return res.json({
      message: "Call ended successfully",
      call: {
        call_id: call._id,
        status: call.status,
        duration: call.duration,
      },
    });
  } catch (err) {
    console.error("endCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Call History
export const getCallHistory = async (req, res) => {
  try {
    const user_id = req.user?.id || req.lawyer?.id;
    const user_type = req.user ? "User" : "Lawyer";

    const calls = await Call.find({
      $or: [
        { caller_id: user_id, caller_type: user_type },
        { receiver_id: user_id, receiver_type: user_type },
      ],
    })
      .populate("caller_id", "name full_name mobile_number")
      .populate("receiver_id", "name full_name mobile_number")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      message: "Call history retrieved successfully",
      calls,
    });
  } catch (err) {
    console.error("getCallHistory error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Call Details
export const getCallDetails = async (req, res) => {
  try {
    const { call_id } = req.params;
    const user_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findById(call_id)
      .populate("caller_id", "name full_name mobile_number email")
      .populate("receiver_id", "name full_name mobile_number email");

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    // Verify user is part of the call
    if (
      call.caller_id._id.toString() !== user_id &&
      call.receiver_id._id.toString() !== user_id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.json({
      message: "Call details retrieved successfully",
      call,
    });
  } catch (err) {
    console.error("getCallDetails error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Call Status (for ringing, missed, etc.)
export const updateCallStatus = async (req, res) => {
  try {
    const { call_id, status } = req.body;

    const call = await Call.findById(call_id);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = status;
    if (status === "missed" || status === "cancelled") {
      call.ended_at = new Date();
    }
    await call.save();

    console.log(`\n🔄 Call Status Updated: ${call_id} -> ${status}`);

    return res.json({
      message: "Call status updated successfully",
      call: {
        call_id: call._id,
        status: call.status,
      },
    });
  } catch (err) {
    console.error("updateCallStatus error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
