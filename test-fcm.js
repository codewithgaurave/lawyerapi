import 'dotenv/config';
import mongoose from 'mongoose';
import admin from 'firebase-admin';

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

const Lawyer = mongoose.model('Lawyer', new mongoose.Schema({
  full_name: String,
  mobile_number: String,
  fcm_token: String,
}, { strict: false }));

// Get Gaurav's FCM token
const lawyer = await Lawyer.findOne({ mobile_number: '9800000001' });

if (!lawyer || !lawyer.fcm_token) {
  console.log('❌ Lawyer or FCM token not found');
  process.exit(1);
}

console.log(`📱 Sending test FCM to: ${lawyer.full_name}`);
console.log(`🔑 Token: ${lawyer.fcm_token.substring(0, 30)}...`);

const message = {
  token: lawyer.fcm_token,
  notification: {
    title: '📞 Incoming Call',
    body: 'Test User is calling...',
  },
  data: {
    type: 'incoming_call',
    callId: 'test-call-123',
    callerName: 'Test User',
    channelName: 'test-channel',
    agoraToken: 'test-token',
  },
  android: {
    priority: 'high',
  },
};

try {
  const response = await admin.messaging().send(message);
  console.log('✅ FCM sent successfully:', response);
} catch (error) {
  console.log('❌ FCM send failed:', error.message);
  if (error.code === 'messaging/invalid-registration-token' || 
      error.code === 'messaging/registration-token-not-registered') {
    console.log('⚠️  Token is invalid or expired - app needs to generate new token');
  }
}

await mongoose.disconnect();
