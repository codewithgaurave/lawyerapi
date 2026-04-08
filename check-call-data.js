import 'dotenv/config';
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  mobile_number: String,
  fcm_token: String,
}, { strict: false }));

const Lawyer = mongoose.model('Lawyer', new mongoose.Schema({
  full_name: String,
  mobile_number: String,
  fcm_token: String,
}, { strict: false }));

// Get test user and lawyer
const user = await User.findOne({ mobile_number: '9800000000' });
const lawyer = await Lawyer.findOne({ mobile_number: '9800000001' });

console.log('\n📋 Test Data:');
console.log(`User: ${user?.name} (${user?.mobile_number})`);
console.log(`User FCM: ${user?.fcm_token ? user.fcm_token.substring(0, 30) + '...' : 'NONE'}`);
console.log(`\nLawyer: ${lawyer?.full_name} (${lawyer?.mobile_number})`);
console.log(`Lawyer FCM: ${lawyer?.fcm_token ? lawyer.fcm_token.substring(0, 30) + '...' : 'NONE'}`);

if (!user || !lawyer) {
  console.log('\n❌ User or Lawyer not found');
  process.exit(1);
}

// Get user token
const userToken = process.env.TEST_USER_TOKEN || '';
if (!userToken) {
  console.log('\n⚠️  Add TEST_USER_TOKEN to .env to test API call');
  console.log('Login as user and copy token from app');
}

await mongoose.disconnect();
