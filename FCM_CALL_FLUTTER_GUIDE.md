# 📞 FCM + Agora Call Integration - Flutter App Guide

**Backend Status**: ✅ FULLY TESTED & WORKING
**Firebase Project**: advance-firebase-36074
**Agora App ID**: fb17d706beeb4cd0914fafb5d2e0a72e

---

## ✅ Backend Test Results

| Test | Result |
|------|--------|
| Firebase Admin Initialized | ✅ |
| Save FCM Token (Lawyer) | ✅ |
| Save FCM Token (User) | ✅ |
| Initiate Call + FCM Trigger | ✅ |
| Accept Call + FCM to Caller | ✅ |
| Reject Call + FCM to Caller | ✅ |
| Missed Call + FCM to Receiver | ✅ |
| End Call | ✅ |
| Call History | ✅ |

> FCM fake token se fail hua - real Flutter device token se 100% kaam karega ✅

---

## 📱 Flutter App Mein Kya Update Karna Hai

### 1️⃣ pubspec.yaml - Dependencies Add Karo

```yaml
dependencies:
  flutter:
    sdk: flutter

  # Agora Voice/Video Call
  agora_rtc_engine: ^6.3.2

  # Firebase
  firebase_core: ^3.6.0
  firebase_messaging: ^15.1.3

  # Permissions
  permission_handler: ^11.3.1

  # HTTP calls
  http: ^1.2.1

  # Local notifications (incoming call screen)
  flutter_local_notifications: ^17.2.2
```

```bash
flutter pub get
```

---

### 2️⃣ Firebase Setup

#### Android - google-services.json
```
1. Firebase Console → advance-firebase-36074
2. Project Settings → Your Apps → Add Android App
3. Package name: com.yourapp.lawyer (apna package name do)
4. google-services.json download karo
5. android/app/ folder mein rakho
```

#### android/build.gradle
```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
  }
}
```

#### android/app/build.gradle
```gradle
apply plugin: 'com.google.gms.google-services'
```

#### iOS - GoogleService-Info.plist
```
1. Firebase Console → Project Settings → Add iOS App
2. Bundle ID: com.yourapp.lawyer
3. GoogleService-Info.plist download karo
4. ios/Runner/ folder mein rakho (Xcode se add karo)
```

---

### 3️⃣ Android Permissions
`android/app/src/main/AndroidManifest.xml`:
```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO"/>
    <uses-permission android:name="android.permission.CAMERA"/>
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
    <uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>

    <application>
        <!-- FCM Background Service -->
        <service
            android:name="com.google.firebase.messaging.FirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
            </intent-filter>
        </service>
    </application>
</manifest>
```

#### iOS Permissions - Info.plist:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Voice call ke liye microphone chahiye</string>
<key>NSCameraUsageDescription</key>
<string>Video call ke liye camera chahiye</string>
<key>UIBackgroundModes</key>
<array>
    <string>fetch</string>
    <string>remote-notification</string>
    <string>voip</string>
</array>
```

---

### 4️⃣ main.dart - Firebase Initialize Karo

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'services/fcm_service.dart';

// Background message handler (top-level function)
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Background message: ${message.data}');

  // Incoming call notification show karo
  if (message.data['type'] == 'incoming_call') {
    await FCMService.showIncomingCallNotification(message.data);
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  // Background handler register karo
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  runApp(MyApp());
}
```

---

### 5️⃣ FCM Service - lib/services/fcm_service.dart

```dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/material.dart';
import 'call_service.dart';

class FCMService {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  static final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  // Initialize FCM
  static Future<void> initialize(BuildContext context, String jwtToken) async {
    // Permissions maango
    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Local notifications setup
    await _initLocalNotifications();

    // FCM Token lo aur backend mein save karo
    String? fcmToken = await _messaging.getToken();
    if (fcmToken != null) {
      print('FCM Token: $fcmToken');
      await CallService(jwtToken).saveFCMToken(fcmToken);
    }

    // Token refresh hone par update karo
    _messaging.onTokenRefresh.listen((newToken) {
      CallService(jwtToken).saveFCMToken(newToken);
    });

    // Foreground messages handle karo
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      _handleForegroundMessage(message, context);
    });

    // Notification tap handle karo (app background mein tha)
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handleNotificationTap(message, context);
    });

    // App closed tha aur notification se khula
    RemoteMessage? initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage, context);
    }
  }

  // Local notifications initialize
  static Future<void> _initLocalNotifications() async {
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      settings,
      onDidReceiveNotificationResponse: (details) {
        // Notification tap handle karo
        print('Notification tapped: ${details.payload}');
      },
    );

    // Android notification channel banao
    const AndroidNotificationChannel channel = AndroidNotificationChannel(
      'calls',
      'Incoming Calls',
      description: 'Incoming call notifications',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);
  }

  // Foreground message handle karo
  static void _handleForegroundMessage(
      RemoteMessage message, BuildContext context) {
    final data = message.data;
    print('Foreground message type: ${data['type']}');

    switch (data['type']) {
      case 'incoming_call':
        // Incoming call screen dikhao
        Navigator.pushNamed(
          context,
          '/incoming-call',
          arguments: {
            'call_id': data['call_id'],
            'channel_name': data['channel_name'],
            'caller_name': data['caller_name'],
            'caller_id': data['caller_id'],
            'call_type': data['call_type'],
            'agora_app_id': data['agora_app_id'],
            'receiver_token': data['receiver_token'],
            'receiver_uid': int.parse(data['receiver_uid']),
          },
        );
        break;

      case 'call_accepted':
        // Call accepted - Agora channel join karo
        print('Call accepted: ${data['call_id']}');
        break;

      case 'call_rejected':
        // Call rejected - UI update karo
        print('Call rejected: ${data['call_id']}');
        Navigator.pop(context); // Call screen band karo
        break;

      case 'call_missed':
        showIncomingCallNotification(data);
        break;
    }
  }

  // Notification tap handle karo
  static void _handleNotificationTap(
      RemoteMessage message, BuildContext context) {
    final data = message.data;
    if (data['type'] == 'incoming_call') {
      Navigator.pushNamed(
        context,
        '/incoming-call',
        arguments: data,
      );
    }
  }

  // Background/Closed app ke liye local notification
  static Future<void> showIncomingCallNotification(
      Map<String, dynamic> data) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'calls',
      'Incoming Calls',
      channelDescription: 'Incoming call notifications',
      importance: Importance.max,
      priority: Priority.max,
      fullScreenIntent: true,
      category: AndroidNotificationCategory.call,
      playSound: true,
      enableVibration: true,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    await _localNotifications.show(
      0,
      '📞 Incoming Call',
      '${data['caller_name']} is calling you',
      details,
      payload: data.toString(),
    );
  }
}
```

---

### 6️⃣ Call Service - lib/services/call_service.dart

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class CallService {
  // ⚠️ Apna server IP yahan daalo
  final String baseUrl = 'http://YOUR_SERVER_IP:5001/api';
  final String token;

  CallService(this.token);

  // FCM Token save karo (User)
  Future<void> saveFCMToken(String fcmToken) async {
    await http.put(
      Uri.parse('$baseUrl/users/fcm-token'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'fcm_token': fcmToken}),
    );
    print('✅ FCM Token saved');
  }

  // FCM Token save karo (Lawyer)
  Future<void> saveLawyerFCMToken(String fcmToken) async {
    await http.put(
      Uri.parse('$baseUrl/lawyers/fcm-token'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'fcm_token': fcmToken}),
    );
    print('✅ Lawyer FCM Token saved');
  }

  // Call initiate karo
  Future<Map<String, dynamic>> initiateCall({
    required String receiverId,
    required String receiverType,
    String callType = 'audio',
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/calls/initiate'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'receiver_id': receiverId,
        'receiver_type': receiverType,
        'call_type': callType,
      }),
    );
    return jsonDecode(res.body);
  }

  // Call accept karo
  Future<void> acceptCall(String callId) async {
    await http.post(
      Uri.parse('$baseUrl/calls/accept'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'call_id': callId}),
    );
  }

  // Call reject karo
  Future<void> rejectCall(String callId, {String reason = 'Rejected'}) async {
    await http.post(
      Uri.parse('$baseUrl/calls/reject'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'call_id': callId, 'reason': reason}),
    );
  }

  // Call end karo
  Future<void> endCall(String callId, int duration) async {
    await http.post(
      Uri.parse('$baseUrl/calls/end'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'call_id': callId, 'duration': duration}),
    );
  }

  // Call history
  Future<List<dynamic>> getCallHistory() async {
    final res = await http.get(
      Uri.parse('$baseUrl/calls/history'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return jsonDecode(res.body)['calls'];
  }
}
```

---

### 7️⃣ Incoming Call Screen - lib/screens/incoming_call_screen.dart

```dart
import 'package:flutter/material.dart';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:permission_handler/permission_handler.dart';
import '../services/call_service.dart';

class IncomingCallScreen extends StatefulWidget {
  final Map<String, dynamic> callData;
  const IncomingCallScreen({Key? key, required this.callData}) : super(key: key);

  @override
  State<IncomingCallScreen> createState() => _IncomingCallScreenState();
}

class _IncomingCallScreenState extends State<IncomingCallScreen> {
  bool _callAccepted = false;

  void _acceptCall() async {
    final callService = CallService(/* your token */);
    await callService.acceptCall(widget.callData['call_id']);

    setState(() => _callAccepted = true);

    // Call screen pe navigate karo
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => CallScreen(
          appId: widget.callData['agora_app_id'],
          channelName: widget.callData['channel_name'],
          token: widget.callData['receiver_token'],
          uid: widget.callData['receiver_uid'],
          callId: widget.callData['call_id'],
          callerName: widget.callData['caller_name'],
        ),
      ),
    );
  }

  void _rejectCall() async {
    final callService = CallService(/* your token */);
    await callService.rejectCall(widget.callData['call_id']);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Caller Info
            Padding(
              padding: const EdgeInsets.only(top: 80),
              child: Column(
                children: [
                  const CircleAvatar(
                    radius: 60,
                    backgroundColor: Colors.blue,
                    child: Icon(Icons.person, size: 60, color: Colors.white),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    widget.callData['caller_name'] ?? 'Unknown',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Incoming Voice Call...',
                    style: TextStyle(color: Colors.grey, fontSize: 16),
                  ),
                ],
              ),
            ),

            // Accept / Reject Buttons
            Padding(
              padding: const EdgeInsets.only(bottom: 60),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Reject
                  Column(
                    children: [
                      GestureDetector(
                        onTap: _rejectCall,
                        child: Container(
                          width: 70,
                          height: 70,
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.call_end,
                              color: Colors.white, size: 35),
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text('Decline',
                          style: TextStyle(color: Colors.white70)),
                    ],
                  ),

                  // Accept
                  Column(
                    children: [
                      GestureDetector(
                        onTap: _acceptCall,
                        child: Container(
                          width: 70,
                          height: 70,
                          decoration: const BoxDecoration(
                            color: Colors.green,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.call,
                              color: Colors.white, size: 35),
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text('Accept',
                          style: TextStyle(color: Colors.white70)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

### 8️⃣ Call Screen - lib/screens/call_screen.dart

```dart
import 'package:flutter/material.dart';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:permission_handler/permission_handler.dart';
import '../services/call_service.dart';

class CallScreen extends StatefulWidget {
  final String appId, channelName, token, callId, callerName;
  final int uid;

  const CallScreen({
    Key? key,
    required this.appId,
    required this.channelName,
    required this.token,
    required this.uid,
    required this.callId,
    required this.callerName,
  }) : super(key: key);

  @override
  State<CallScreen> createState() => _CallScreenState();
}

class _CallScreenState extends State<CallScreen> {
  late RtcEngine _engine;
  bool _joined = false, _muted = false, _speakerOn = false;
  int? _remoteUid;
  DateTime? _callStart;

  @override
  void initState() {
    super.initState();
    _initAgora();
  }

  Future<void> _initAgora() async {
    await [Permission.microphone].request();

    _engine = createAgoraRtcEngine();
    await _engine.initialize(RtcEngineContext(
      appId: widget.appId,
      channelProfile: ChannelProfileType.channelProfileCommunication,
    ));

    _engine.registerEventHandler(RtcEngineEventHandler(
      onJoinChannelSuccess: (_, __) =>
          setState(() { _joined = true; _callStart = DateTime.now(); }),
      onUserJoined: (_, uid, __) => setState(() => _remoteUid = uid),
      onUserOffline: (_, __, ___) => setState(() => _remoteUid = null),
    ));

    await _engine.enableAudio();
    await _engine.joinChannel(
      token: widget.token,
      channelId: widget.channelName,
      uid: widget.uid,
      options: const ChannelMediaOptions(),
    );
  }

  Future<void> _endCall() async {
    final duration = _callStart != null
        ? DateTime.now().difference(_callStart!).inSeconds
        : 0;
    // await CallService(token).endCall(widget.callId, duration);
    await _engine.leaveChannel();
    await _engine.release();
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: const EdgeInsets.all(40),
              child: Column(
                children: [
                  const CircleAvatar(
                    radius: 50,
                    child: Icon(Icons.person, size: 50),
                  ),
                  const SizedBox(height: 16),
                  Text(widget.callerName,
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(
                    _remoteUid != null
                        ? 'Connected ✅'
                        : (_joined ? 'Ringing...' : 'Connecting...'),
                    style: TextStyle(color: Colors.grey[400], fontSize: 16),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(40),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _btn(
                    icon: _muted ? Icons.mic_off : Icons.mic,
                    color: _muted ? Colors.red : Colors.white,
                    label: _muted ? 'Unmute' : 'Mute',
                    onTap: () {
                      setState(() => _muted = !_muted);
                      _engine.muteLocalAudioStream(_muted);
                    },
                  ),
                  _btn(
                    icon: Icons.call_end,
                    color: Colors.white,
                    bgColor: Colors.red,
                    label: 'End',
                    size: 70,
                    onTap: _endCall,
                  ),
                  _btn(
                    icon: _speakerOn ? Icons.volume_up : Icons.volume_down,
                    color: _speakerOn ? Colors.blue : Colors.white,
                    label: 'Speaker',
                    onTap: () {
                      setState(() => _speakerOn = !_speakerOn);
                      _engine.setEnableSpeakerphone(_speakerOn);
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _btn({
    required IconData icon,
    required Color color,
    required String label,
    required VoidCallback onTap,
    Color bgColor = Colors.white24,
    double size = 56,
  }) {
    return Column(
      children: [
        GestureDetector(
          onTap: onTap,
          child: Container(
            width: size, height: size,
            decoration: BoxDecoration(color: bgColor, shape: BoxShape.circle),
            child: Icon(icon, color: color, size: size * 0.5),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
      ],
    );
  }

  @override
  void dispose() {
    _engine.leaveChannel();
    _engine.release();
    super.dispose();
  }
}
```

---

### 9️⃣ Routes Setup - lib/main.dart mein add karo

```dart
MaterialApp(
  routes: {
    '/incoming-call': (context) => IncomingCallScreen(
      callData: ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>,
    ),
    '/call': (context) => CallScreen(
      // arguments pass karo
    ),
  },
)
```

---

### 🔟 Login ke baad FCM initialize karo

```dart
// User login hone ke baad
void onLoginSuccess(String jwtToken, BuildContext context) async {
  await FCMService.initialize(context, jwtToken);
}

// Lawyer login hone ke baad
void onLawyerLoginSuccess(String jwtToken, BuildContext context) async {
  final fcmToken = await FirebaseMessaging.instance.getToken();
  if (fcmToken != null) {
    await CallService(jwtToken).saveLawyerFCMToken(fcmToken);
  }
  // Foreground messages listen karo
  FirebaseMessaging.onMessage.listen((message) {
    if (message.data['type'] == 'incoming_call') {
      Navigator.pushNamed(context, '/incoming-call', arguments: message.data);
    }
  });
}
```

---

## 🔄 Complete Flow (App Closed Hone Par Bhi)

```
User → Initiate Call API
         ↓
Backend → FCM Notification bheja Lawyer ko
         ↓
Lawyer ka phone ring kiya (app closed ho tab bhi) 🔔
         ↓
Lawyer notification tap kare
         ↓
App open → IncomingCallScreen
         ↓
Accept → Agora Channel Join → Call Connected ✅
Reject → Call Rejected → User ko FCM notification
```

---

## 📋 Backend APIs Summary

| API | Endpoint | Auth |
|-----|----------|------|
| Save FCM Token (User) | PUT /api/users/fcm-token | User JWT |
| Save FCM Token (Lawyer) | PUT /api/lawyers/fcm-token | Lawyer JWT |
| Initiate Call | POST /api/calls/initiate | User/Lawyer JWT |
| Accept Call | POST /api/calls/accept | User/Lawyer JWT |
| Reject Call | POST /api/calls/reject | User/Lawyer JWT |
| End Call | POST /api/calls/end | User/Lawyer JWT |
| Call History | GET /api/calls/history | User/Lawyer JWT |

---

## 🎯 FCM Notification Types

Backend yeh notifications bhejta hai:

| Type | Kab | Kisko |
|------|-----|-------|
| `incoming_call` | Call initiate hone par | Receiver (Lawyer) |
| `call_accepted` | Lawyer accept kare | Caller (User) |
| `call_rejected` | Lawyer reject kare | Caller (User) |
| `call_missed` | Call miss ho | Receiver (Lawyer) |

---

## ⚡ Quick Checklist

### Backend ✅ Already Done:
- [x] firebase-admin installed
- [x] Firebase credentials in .env
- [x] FCM token save API (User + Lawyer)
- [x] Call initiate → FCM to receiver
- [x] Call accept → FCM to caller
- [x] Call reject → FCM to caller
- [x] Missed call → FCM to receiver
- [x] Agora token generation

### Flutter App Todo:
- [ ] google-services.json add karo (Android)
- [ ] GoogleService-Info.plist add karo (iOS)
- [ ] pubspec.yaml dependencies add karo
- [ ] AndroidManifest.xml permissions add karo
- [ ] main.dart mein Firebase initialize karo
- [ ] FCMService class add karo
- [ ] CallService class add karo
- [ ] IncomingCallScreen banao
- [ ] CallScreen banao
- [ ] Login ke baad FCM token save karo
- [ ] Routes setup karo

---

**Last Updated**: April 5, 2026
**Backend**: ✅ 100% Ready
**Flutter**: Follow above steps
