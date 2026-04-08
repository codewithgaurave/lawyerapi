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

await mongoose.connect(process.env.MONGO_URI);

const Lawyer = mongoose.model('Lawyer', new mongoose.Schema({}, { strict: false }));

const lawyer = await Lawyer.findOne({ mobile_number: '9800000001' });

if (!lawyer || !lawyer.fcm_token) {
  console.log('❌ Lawyer or FCM token not found');
  process.exit(1);
}

console.log(`📱 Sending FCM to Lawyer: ${lawyer.full_name}`);
console.log(`🔑 Token: ${lawyer.fcm_token.substring(0, 30)}...`);

const message = {
  token: lawyer.fcm_token,
  notification: {
    title: '📞 Incoming Call',
    body: 'Gaurav Gupta (User) is calling...',
  },
  data: {
    type: 'incoming_call',
    call_id: 'test-user-to-lawyer-123',
    channel_name: 'test-channel-user-lawyer',
    caller_name: 'Gaurav Gupta',
    caller_id: '69cf096e67cf7a5d6c23dd7a',
    call_type: 'audio',
    agora_app_id: process.env.AGORA_APP_ID,
    receiver_token: 'test-token',
    receiver_uid: '123456',
  },
  android: {
    priority: 'high',
  },
};

try {
  const response = await admin.messaging().send(message);
  console.log('✅ FCM sent successfully:', response);
  console.log('\n📱 Check Lawyer phone for notification!');
} catch (error) {
  console.log('❌ FCM send failed:', error.message);
  if (error.code === 'messaging/invalid-registration-token' || 
      error.code === 'messaging/registration-token-not-registered') {
    console.log('⚠️  Lawyer token is invalid - Lawyer needs to login again');
  }
}

await mongoose.disconnect();
