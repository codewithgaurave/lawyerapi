import agoraToken from "agora-token";
const { RtcTokenBuilder, RtcRole } = agoraToken;
import Call from "../models/Call.js";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";
import {
  sendIncomingCallNotification,
  sendCallAcceptedNotification,
  sendCallRejectedNotification,
  sendCallMissedNotification,
} from "../config/firebase.js";

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const TOKEN_EXPIRATION_TIME = 24 * 3600;

const generateChannelName = () =>
  `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateAgoraToken = (channelName, uid, role = 1) => {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    throw new Error("Agora credentials not configured");
  }
  const expiry = Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_TIME;
  return RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID, AGORA_APP_CERTIFICATE, channelName, uid, role, expiry
  );
};

// ─── Initiate Call ────────────────────────────────────────────────────────────
export const initiateCall = async (req, res) => {
  try {
    const { receiver_id, receiver_type, call_type } = req.body;
    const caller_id = req.user?.id || req.lawyer?.id;
    const caller_type = req.user ? "User" : "Lawyer";

    if (!receiver_id || !receiver_type)
      return res.status(400).json({ message: "Receiver details required" });

    // Get receiver
    const ReceiverModel = receiver_type === "User" ? User : Lawyer;
    const receiver = await ReceiverModel.findById(receiver_id);
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    // Get caller info
    const CallerModel = caller_type === "User" ? User : Lawyer;
    const caller = await CallerModel.findById(caller_id);
    const callerName = caller?.name || caller?.full_name || "Unknown";

    // Generate Agora tokens
    const channel_name = generateChannelName();
    const caller_uid = Math.floor(Math.random() * 1000000);
    const receiver_uid = Math.floor(Math.random() * 1000000);
    const caller_token = generateAgoraToken(channel_name, caller_uid);
    const receiver_token = generateAgoraToken(channel_name, receiver_uid);

    // Save call to DB
    const call = await Call.create({
      caller_id, caller_type,
      receiver_id, receiver_type,
      channel_name,
      call_type: call_type || "audio",
      status: "initiated",
      agora_uid_caller: caller_uid,
      agora_uid_receiver: receiver_uid,
    });

    console.log(`\n📞 Call Initiated: ${channel_name}`);

    // ── Send FCM notification to receiver ──────────────────────────────────
    const receiverFcmToken = receiver.fcm_token;
    let fcmResult = { success: false, reason: "No FCM token" };

    // Always set to ringing so polling works even if FCM fails
    call.status = "ringing";
    await call.save();

    if (receiverFcmToken) {
      fcmResult = await sendIncomingCallNotification(receiverFcmToken, {
        callId: call._id.toString(),
        channelName: channel_name,
        callerName,
        callerId: caller_id,
        callType: call_type || "audio",
        agoraAppId: AGORA_APP_ID,
        receiverToken: receiver_token,
        receiverUid: receiver_uid,
      });
    } else {
      console.log("⚠️  Receiver has no FCM token - falling back to polling");
    }

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
      fcm: fcmResult,
    });
  } catch (err) {
    console.error("initiateCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Get Agora Token ──────────────────────────────────────────────────────────
export const getAgoraToken = async (req, res) => {
  try {
    const { channel_name, uid } = req.body;
    if (!channel_name || !uid)
      return res.status(400).json({ message: "Channel name and UID required" });

    const call = await Call.findOne({ channel_name });
    if (!call) return res.status(404).json({ message: "Call not found" });

    const token = generateAgoraToken(channel_name, uid);
    return res.json({
      message: "Token generated successfully",
      agora: { app_id: AGORA_APP_ID, channel_name, token, uid },
    });
  } catch (err) {
    console.error("getAgoraToken error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Accept Call ──────────────────────────────────────────────────────────────
export const acceptCall = async (req, res) => {
  try {
    const { call_id } = req.body;
    const receiver_id = req.user?.id || req.lawyer?.id;
    const receiver_type = req.user ? "User" : "Lawyer";

    const call = await Call.findById(call_id);
    if (!call) return res.status(404).json({ message: "Call not found" });

    if (call.receiver_id.toString() !== receiver_id)
      return res.status(403).json({ message: "Unauthorized" });

    if (!["initiated", "ringing"].includes(call.status))
      return res.status(400).json({ message: "Call cannot be accepted" });

    call.status = "accepted";
    call.accepted_at = new Date();
    await call.save();

    // ── Notify caller that call was accepted ───────────────────────────────
    const CallerModel = call.caller_type === "User" ? User : Lawyer;
    const caller = await CallerModel.findById(call.caller_id);
    const ReceiverModel = receiver_type === "User" ? User : Lawyer;
    const receiver = await ReceiverModel.findById(receiver_id);
    const receiverName = receiver?.name || receiver?.full_name || "Unknown";

    if (caller?.fcm_token) {
      await sendCallAcceptedNotification(caller.fcm_token, {
        callId: call._id.toString(),
        channelName: call.channel_name,
        receiverName,
      });
    }

    console.log(`\n✅ Call Accepted: ${call_id}`);
    return res.json({
      message: "Call accepted successfully",
      call: { call_id: call._id, channel_name: call.channel_name, status: call.status },
    });
  } catch (err) {
    console.error("acceptCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Reject Call ──────────────────────────────────────────────────────────────
export const rejectCall = async (req, res) => {
  try {
    const { call_id, reason } = req.body;
    const receiver_id = req.user?.id || req.lawyer?.id;
    const receiver_type = req.user ? "User" : "Lawyer";

    const call = await Call.findById(call_id);
    if (!call) return res.status(404).json({ message: "Call not found" });

    if (call.receiver_id.toString() !== receiver_id)
      return res.status(403).json({ message: "Unauthorized" });

    call.status = "rejected";
    call.rejection_reason = reason || "Rejected";
    call.ended_at = new Date();
    await call.save();

    // ── Notify caller that call was rejected ───────────────────────────────
    const CallerModel = call.caller_type === "User" ? User : Lawyer;
    const caller = await CallerModel.findById(call.caller_id);
    const ReceiverModel = receiver_type === "User" ? User : Lawyer;
    const receiver = await ReceiverModel.findById(receiver_id);
    const receiverName = receiver?.name || receiver?.full_name || "Unknown";

    if (caller?.fcm_token) {
      await sendCallRejectedNotification(caller.fcm_token, {
        callId: call._id.toString(),
        receiverName,
      });
    }

    console.log(`\n❌ Call Rejected: ${call_id}`);
    return res.json({
      message: "Call rejected successfully",
      call: { call_id: call._id, status: call.status },
    });
  } catch (err) {
    console.error("rejectCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── End Call ─────────────────────────────────────────────────────────────────
export const endCall = async (req, res) => {
  try {
    const { call_id, duration } = req.body;
    const user_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findById(call_id);
    if (!call) return res.status(404).json({ message: "Call not found" });

    if (
      call.caller_id.toString() !== user_id &&
      call.receiver_id.toString() !== user_id
    ) return res.status(403).json({ message: "Unauthorized" });

    call.status = "ended";
    call.ended_at = new Date();
    call.duration = duration || 0;
    await call.save();

    console.log(`\n📴 Call Ended: ${call_id} (${duration}s)`);
    return res.json({
      message: "Call ended successfully",
      call: { call_id: call._id, status: call.status, duration: call.duration },
    });
  } catch (err) {
    console.error("endCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Update Call Status ───────────────────────────────────────────────────────
export const updateCallStatus = async (req, res) => {
  try {
    const { call_id, status } = req.body;
    const user_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findById(call_id);
    if (!call) return res.status(404).json({ message: "Call not found" });

    call.status = status;
    if (["missed", "cancelled", "ended"].includes(status)) {
      call.ended_at = new Date();

      // ── Notify caller if missed ────────────────────────────────────────
      if (status === "missed") {
        const CallerModel = call.caller_type === "User" ? User : Lawyer;
        const caller = await CallerModel.findById(call.caller_id);
        const ReceiverModel = call.receiver_type === "User" ? User : Lawyer;
        const receiver = await ReceiverModel.findById(call.receiver_id);
        const callerName = caller?.name || caller?.full_name || "Unknown";

        if (receiver?.fcm_token) {
          await sendCallMissedNotification(receiver.fcm_token, {
            callId: call._id.toString(),
            callerName,
          });
        }
      }
    }

    await call.save();
    console.log(`\n🔄 Call Status: ${call_id} → ${status}`);
    return res.json({
      message: "Call status updated successfully",
      call: { call_id: call._id, status: call.status },
    });
  } catch (err) {
    console.error("updateCallStatus error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Get Incoming Ringing Call ───────────────────────────────────────────────
export const getIncomingCall = async (req, res) => {
  try {
    const user_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findOne({
      receiver_id: user_id,
      status: "ringing",
    })
      .populate("caller_id", "name full_name")
      .sort({ createdAt: -1 });

    if (!call) return res.json({ call: null });

    const callerName =
      call.caller_id?.name || call.caller_id?.full_name || "User";

    return res.json({
      call: {
        _id: call._id,
        channel_name: call.channel_name,
        caller_name: callerName,
        caller_id: call.caller_id?._id,
        agora_uid_receiver: call.agora_uid_receiver,
        status: call.status,
      },
    });
  } catch (err) {
    console.error("getIncomingCall error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Get Call History ─────────────────────────────────────────────────────────
export const getCallHistory = async (req, res) => {
  try {
    const user_id = req.user?.id || req.lawyer?.id;

    const calls = await Call.find({
      $or: [{ caller_id: user_id }, { receiver_id: user_id }],
    })
      .populate("caller_id", "name full_name mobile_number")
      .populate("receiver_id", "name full_name mobile_number")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ message: "Call history retrieved successfully", calls });
  } catch (err) {
    console.error("getCallHistory error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── Get Call Details ─────────────────────────────────────────────────────────
export const getCallDetails = async (req, res) => {
  try {
    const { call_id } = req.params;
    const user_id = req.user?.id || req.lawyer?.id;

    const call = await Call.findById(call_id)
      .populate("caller_id", "name full_name mobile_number email")
      .populate("receiver_id", "name full_name mobile_number email");

    if (!call) return res.status(404).json({ message: "Call not found" });

    if (
      call.caller_id._id.toString() !== user_id &&
      call.receiver_id._id.toString() !== user_id
    ) return res.status(403).json({ message: "Unauthorized" });

    return res.json({ message: "Call details retrieved successfully", call });
  } catch (err) {
    console.error("getCallDetails error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
