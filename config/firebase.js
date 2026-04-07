import admin from "firebase-admin";

let firebaseInitialized = false;

const initFirebase = () => {
  if (firebaseInitialized) return;

  if (
    !process.env.FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID === "your_project_id" ||
    !process.env.FIREBASE_PRIVATE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY.includes("your_private_key")
  ) {
    console.log("⚠️  Firebase credentials not configured - FCM disabled");
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
      }),
    });
    firebaseInitialized = true;
    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.log("⚠️  Firebase init failed:", err.message);
  }
};

export const sendIncomingCallNotification = async (fcmToken, callData) => {
  if (!firebaseInitialized) return { success: false, reason: "FCM not configured" };
  if (!fcmToken) return { success: false, reason: "No FCM token" };

  try {
    // notification field ZAROORI hai - isse Android khud notification dikhata hai
    // app killed/background dono mein. Tap karne par getInitialMessage() se
    // saara data milta hai Flutter ko.
    const message = {
      token: fcmToken,
      notification: {
        title: "📞 Incoming Call",
        body: `${callData.callerName} is calling you`,
      },
      // data mein saara call info bhejo - getInitialMessage() se milega
      data: {
        type: "incoming_call",
        call_id: String(callData.callId),
        channel_name: String(callData.channelName),
        caller_name: String(callData.callerName),
        caller_id: String(callData.callerId),
        call_type: String(callData.callType || "audio"),
        agora_app_id: String(callData.agoraAppId),
        receiver_token: String(callData.receiverToken),
        receiver_uid: String(callData.receiverUid),
      },
      android: {
        priority: "high",
        notification: {
          channel_id: "calls",
          priority: "max",
          visibility: "public",
          sound: "default",
          // fullScreenIntent - lock screen par bhi dikhega
          notification_priority: "PRIORITY_MAX",
          default_vibrate_timings: true,
        },
      },
      apns: {
        headers: { "apns-priority": "10", "apns-push-type": "alert" },
        payload: {
          aps: { sound: "default", badge: 1, "content-available": 1 },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Call FCM sent:", response);
    return { success: true, messageId: response };
  } catch (err) {
    console.error("❌ FCM send error:", err.message);
    return { success: false, error: err.message };
  }
};

// Normal notifications (non-call) ke liye
export const sendFCMNotification = async (fcmToken, title, body, data = {}) => {
  if (!firebaseInitialized) return { success: false, reason: "FCM not configured" };
  if (!fcmToken) return { success: false, reason: "No FCM token" };

  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
      android: {
        priority: "high",
        notification: { channel_id: "calls", sound: "default" },
      },
      apns: {
        headers: { "apns-priority": "10" },
        payload: { aps: { sound: "default", badge: 1 } },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ FCM sent:", response);
    return { success: true, messageId: response };
  } catch (err) {
    console.error("❌ FCM send error:", err.message);
    return { success: false, error: err.message };
  }
};

export const sendCallAcceptedNotification = async (fcmToken, callData) =>
  sendFCMNotification(fcmToken, "✅ Call Accepted", `${callData.receiverName} accepted your call`, {
    type: "call_accepted",
    call_id: callData.callId,
    channel_name: callData.channelName,
  });

export const sendCallRejectedNotification = async (fcmToken, callData) =>
  sendFCMNotification(fcmToken, "❌ Call Rejected", `${callData.receiverName} rejected your call`, {
    type: "call_rejected",
    call_id: callData.callId,
  });

export const sendCallMissedNotification = async (fcmToken, callData) =>
  sendFCMNotification(fcmToken, "📵 Missed Call", `You missed a call from ${callData.callerName}`, {
    type: "call_missed",
    call_id: callData.callId,
    caller_name: callData.callerName,
  });

initFirebase();
export default admin;
