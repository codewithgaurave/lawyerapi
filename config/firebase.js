import admin from "firebase-admin";

let firebaseInitialized = false;

const initFirebase = () => {
  if (firebaseInitialized) return;

  if (!process.env.FIREBASE_PROJECT_ID || 
      process.env.FIREBASE_PROJECT_ID === 'your_project_id' ||
      !process.env.FIREBASE_PRIVATE_KEY ||
      process.env.FIREBASE_PRIVATE_KEY.includes('your_private_key')) {
    console.log("⚠️  Firebase credentials not configured - FCM notifications disabled");
    return;
  }

  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.log("⚠️  Firebase init failed:", err.message);
  }
};

// Send FCM notification
export const sendFCMNotification = async (fcmToken, title, body, data = {}) => {
  if (!firebaseInitialized) {
    console.log("⚠️  FCM not initialized, skipping notification");
    return { success: false, reason: "FCM not configured" };
  }

  if (!fcmToken) {
    console.log("⚠️  No FCM token provided");
    return { success: false, reason: "No FCM token" };
  }

  try {
    const isCallNotification = data.type === "incoming_call";

    const message = {
      token: fcmToken,
      data: Object.fromEntries(
        Object.entries({ ...data, title, body }).map(([k, v]) => [k, String(v)])
      ),
      android: {
        priority: "high",
        // Call notification ke liye notification field mat bhejo
        // Flutter background handler trigger hoga aur getInitialMessage() kaam karega
        ...(isCallNotification
          ? {}
          : {
              notification: {
                title,
                body,
                sound: "default",
                channelId: "calls",
                priority: "max",
                visibility: "public",
              },
            }),
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            contentAvailable: true,
          },
        },
        headers: {
          "apns-priority": "10",
          "apns-push-type": isCallNotification ? "background" : "alert",
        },
      },
    };

    // Non-call notifications ke liye notification field add karo
    if (!isCallNotification) {
      message.notification = { title, body };
    }

    const response = await admin.messaging().send(message);
    console.log("✅ FCM sent:", response);
    return { success: true, messageId: response };
  } catch (err) {
    console.error("❌ FCM send error:", err.message);
    return { success: false, error: err.message };
  }
};

// Send incoming call notification
export const sendIncomingCallNotification = async (fcmToken, callData) => {
  return sendFCMNotification(
    fcmToken,
    "📞 Incoming Call",
    `${callData.callerName} is calling you`,
    {
      type: "incoming_call",
      call_id: callData.callId,
      channel_name: callData.channelName,
      caller_name: callData.callerName,
      caller_id: callData.callerId,
      call_type: callData.callType,
      agora_app_id: callData.agoraAppId,
      receiver_token: callData.receiverToken,
      receiver_uid: String(callData.receiverUid),
    }
  );
};

// Send call accepted notification
export const sendCallAcceptedNotification = async (fcmToken, callData) => {
  return sendFCMNotification(
    fcmToken,
    "✅ Call Accepted",
    `${callData.receiverName} accepted your call`,
    {
      type: "call_accepted",
      call_id: callData.callId,
      channel_name: callData.channelName,
    }
  );
};

// Send call rejected notification
export const sendCallRejectedNotification = async (fcmToken, callData) => {
  return sendFCMNotification(
    fcmToken,
    "❌ Call Rejected",
    `${callData.receiverName} rejected your call`,
    {
      type: "call_rejected",
      call_id: callData.callId,
    }
  );
};

// Send call missed notification
export const sendCallMissedNotification = async (fcmToken, callData) => {
  return sendFCMNotification(
    fcmToken,
    "📵 Missed Call",
    `You missed a call from ${callData.callerName}`,
    {
      type: "call_missed",
      call_id: callData.callId,
      caller_name: callData.callerName,
    }
  );
};

initFirebase();
export default admin;
