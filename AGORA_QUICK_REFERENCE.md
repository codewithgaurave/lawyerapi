# 🚀 Agora Call - Quick Reference

**App ID**: `fb17d706beeb4cd0914fafb5d2e0a72e`
**Server**: `http://localhost:5001`

---

## ⚡ Quick Setup (5 Minutes)

### 1. Agora Certificate Lao
```
1. https://console.agora.io/ → Login
2. Project kholo → Config
3. Primary Certificate copy karo
```

### 2. Backend Setup
```bash
cd /Users/kiran_maddheshiya/Downloads/lawyerappAPI
nano .env

# Add:
AGORA_APP_CERTIFICATE=paste_here

# Start server:
npm start
```

### 3. Test API
```bash
# Health check
curl http://localhost:5001/health
```

---

## 📋 API Quick Reference

### Base URL
```
http://localhost:5001/api/calls
```

### Headers
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

## 🔥 Common APIs

### 1. Initiate Call
```bash
POST /api/calls/initiate
{
  "receiver_id": "lawyer_id",
  "receiver_type": "Lawyer",
  "call_type": "audio"
}
```

### 2. Accept Call
```bash
POST /api/calls/accept
{
  "call_id": "call_id_here"
}
```

### 3. End Call
```bash
POST /api/calls/end
{
  "call_id": "call_id_here",
  "duration": 120
}
```

### 4. Get History
```bash
GET /api/calls/history
```

---

## 📱 Flutter Quick Setup

### Dependencies
```yaml
dependencies:
  agora_rtc_engine: ^6.3.2
  permission_handler: ^11.3.1
  http: ^1.2.1
```

### Permissions (Android)
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
<uses-permission android:name="android.permission.CAMERA"/>
```

### Permissions (iOS)
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Need microphone for calls</string>
```

---

## 🎯 Call Flow

```
1. User → Initiate Call API
2. Backend → Generate Token
3. User → Join Agora Channel
4. Lawyer → Accept Call
5. Lawyer → Join Agora Channel
6. Call Connected! 🎉
7. End Call → Save Duration
```

---

## 🔑 Important Values

### From Backend Response:
```json
{
  "agora": {
    "app_id": "fb17d706beeb4cd0914fafb5d2e0a72e",
    "channel_name": "call_1775379506947_xjws728ut",
    "caller_token": "007eJxTYFA...",
    "caller_uid": 776780
  }
}
```

### Use in Flutter:
```dart
RtcEngine.initialize(RtcEngineContext(
  appId: "fb17d706beeb4cd0914fafb5d2e0a72e",
));

engine.joinChannel(
  token: "007eJxTYFA...",
  channelId: "call_1775379506947_xjws728ut",
  uid: 776780,
);
```

---

## 🐛 Quick Fixes

### Server not starting?
```bash
# Check logs
tail -f /tmp/server.log

# Restart
pkill -f "node server.js"
npm start
```

### Token error?
```bash
# Check .env
cat .env | grep AGORA

# Should show both:
AGORA_APP_ID=fb17d706beeb4cd0914fafb5d2e0a72e
AGORA_APP_CERTIFICATE=your_certificate
```

### Call not connecting?
- Check internet
- Verify token not expired
- Check channel name matches
- Verify UID is correct

---

## 📞 Test Commands

### Complete Test
```bash
# 1. Login User
curl -X POST http://localhost:5001/api/users/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "9999999999"}'

# Get OTP from response, then:
curl -X POST http://localhost:5001/api/users/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile_number": "9999999999", "otp": "123456", "name": "Test"}'

# Save token, then:
curl -X POST http://localhost:5001/api/calls/initiate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiver_id": "LAWYER_ID", "receiver_type": "Lawyer", "call_type": "audio"}'
```

---

## ✅ Checklist

### Backend:
- [ ] Server running
- [ ] Agora credentials set
- [ ] APIs tested

### Flutter:
- [ ] Dependencies added
- [ ] Permissions set
- [ ] API service created
- [ ] Call screen created

---

## 🎯 Key Points

1. **App ID**: `fb17d706beeb4cd0914fafb5d2e0a72e` (Already set)
2. **Certificate**: Get from Agora Console
3. **Token**: Backend generates automatically
4. **Channel**: Backend creates unique name
5. **UID**: Backend generates random number

---

## 📚 Full Documentation

For complete guide, see: `AGORA_CALL_INTEGRATION_GUIDE.md`

---

**Status**: ✅ READY
**Last Updated**: April 5, 2026
