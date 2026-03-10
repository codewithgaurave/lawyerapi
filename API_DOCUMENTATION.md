# Lawyer App API - Complete Documentation with Examples

## Base URL: `http://localhost:5001`

---

## 1. ADMIN APIs

### 1.1 Create Admin
**POST** `/api/admin/create`

**Request Body:**
```json
{
  "adminId": "admin123",
  "password": "test123",
  "name": "Test Admin"
}
```

**Response (201):**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "adminId": "admin123",
    "name": "Test Admin",
    "id": "69ad952ab23d3a909a42fcf7"
  }
}
```

---

### 1.2 Admin Login
**POST** `/api/admin/login`

**Request Body:**
```json
{
  "adminId": "admin123",
  "password": "test123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "admin": {
    "adminId": "admin123",
    "name": "Test Admin",
    "id": "69ad952ab23d3a909a42fcf7"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.3 List All Admins
**GET** `/api/admin/list`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "admins": [
    {
      "_id": "69ad952ab23d3a909a42fcf7",
      "adminId": "admin123",
      "name": "Test Admin",
      "createdAt": "2026-03-08T15:26:34.173Z",
      "updatedAt": "2026-03-08T15:26:34.173Z"
    }
  ]
}
```

---

### 1.4 Logout All Sessions
**POST** `/api/admin/logout-all`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "message": "Logged out from all sessions"
}
```

---

## 2. LAWYER APIs

### 2.1 Register Lawyer
**POST** `/api/lawyers/register`

**Request Body:**
```json
{
  "full_name": "Rajesh Kumar",
  "mobile_number": "9876543210",
  "email": "rajesh@lawyer.com",
  "password": "test123",
  "bar_council_number": "BAR12345",
  "bar_council_state": "Delhi",
  "years_of_experience": 5,
  "specialization": "Criminal Law",
  "classification": "Criminal",
  "office_address": "123 Court Road",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001"
}
```

**Response (201):**
```json
{
  "message": "Lawyer registered successfully",
  "lawyer": {
    "id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh@lawyer.com"
  }
}
```

---

### 2.2 Lawyer Login
**POST** `/api/lawyers/login`

**Request Body:**
```json
{
  "mobile_number": "9876543210",
  "password": "test123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "lawyer": {
    "id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh@lawyer.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2.3 Get Lawyer Profile
**GET** `/api/lawyers/profile`

**Headers:**
```
Authorization: Bearer {lawyer_token}
```

**Response (200):**
```json
{
  "lawyer": {
    "_id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh@lawyer.com",
    "bar_council_number": "BAR12345",
    "bar_council_state": "Delhi",
    "years_of_experience": 5,
    "specialization": "Criminal Law",
    "classification": "Criminal",
    "sub_classification": null,
    "office_address": "123 Court Road",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "bar_enrollment_date": null,
    "court_practice": null,
    "law_degree": null,
    "university_name": null,
    "graduation_year": null,
    "license_document": null,
    "bar_council_certificate": null,
    "about_lawyer": null,
    "languages_spoken": [],
    "consultation_fee": null,
    "availability_time": null,
    "office_latitude": null,
    "office_longitude": null,
    "isActive": true,
    "createdAt": "2026-03-08T15:52:27.297Z",
    "updatedAt": "2026-03-08T15:52:27.297Z"
  }
}
```

---

### 2.4 Update Lawyer Profile
**PUT** `/api/lawyers/profile`

**Headers:**
```
Authorization: Bearer {lawyer_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "about_lawyer": "Experienced criminal lawyer with 5 years of practice",
  "consultation_fee": 2000,
  "languages_spoken": ["Hindi", "English", "Punjabi"],
  "sub_classification": "Property Law",
  "bar_enrollment_date": "2018-06-15",
  "court_practice": "High Court",
  "law_degree": "LLB",
  "university_name": "Delhi University",
  "graduation_year": 2017,
  "availability_time": "Mon-Fri: 10AM-6PM",
  "office_latitude": 28.6139,
  "office_longitude": 77.2090
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "lawyer": {
    "_id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh@lawyer.com",
    "bar_council_number": "BAR12345",
    "bar_council_state": "Delhi",
    "years_of_experience": 5,
    "specialization": "Criminal Law",
    "classification": "Criminal",
    "sub_classification": "Property Law",
    "office_address": "123 Court Road",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "bar_enrollment_date": "2018-06-15T00:00:00.000Z",
    "court_practice": "High Court",
    "law_degree": "LLB",
    "university_name": "Delhi University",
    "graduation_year": 2017,
    "about_lawyer": "Experienced criminal lawyer with 5 years of practice",
    "languages_spoken": ["Hindi", "English", "Punjabi"],
    "consultation_fee": 2000,
    "availability_time": "Mon-Fri: 10AM-6PM",
    "office_latitude": 28.6139,
    "office_longitude": 77.2090,
    "isActive": true,
    "createdAt": "2026-03-08T15:52:27.297Z",
    "updatedAt": "2026-03-08T16:10:15.519Z"
  }
}
```

---

## 3. SERVICE APIs

### 3.1 Add Service
**POST** `/api/services`

**Headers:**
```
Authorization: Bearer {lawyer_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "service_name": "Legal Consultation",
  "description": "One hour legal consultation for criminal cases",
  "price": 1500,
  "duration": "1 hour"
}
```

**Response (201):**
```json
{
  "message": "Service added successfully",
  "service": {
    "_id": "69ad9f2a3b8743a56e89d8ae",
    "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
    "service_name": "Legal Consultation",
    "description": "One hour legal consultation for criminal cases",
    "price": 1500,
    "duration": "1 hour",
    "createdAt": "2026-03-08T16:15:22.297Z",
    "updatedAt": "2026-03-08T16:15:22.297Z"
  }
}
```

---

### 3.2 Get My Services
**GET** `/api/services/my-services`

**Headers:**
```
Authorization: Bearer {lawyer_token}
```

**Response (200):**
```json
{
  "services": [
    {
      "_id": "69ad9f2a3b8743a56e89d8ae",
      "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
      "service_name": "Legal Consultation",
      "description": "One hour legal consultation for criminal cases",
      "price": 1500,
      "duration": "1 hour",
      "createdAt": "2026-03-08T16:15:22.297Z",
      "updatedAt": "2026-03-08T16:15:22.297Z"
    },
    {
      "_id": "69ad9f5c4c8743a56e89d8af",
      "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
      "service_name": "Court Representation",
      "description": "Full court representation for criminal cases",
      "price": 25000,
      "duration": "Per case",
      "createdAt": "2026-03-08T16:16:10.297Z",
      "updatedAt": "2026-03-08T16:16:10.297Z"
    }
  ]
}
```

---

### 3.3 Update Service
**PUT** `/api/services/:id`

**Headers:**
```
Authorization: Bearer {lawyer_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "price": 2000,
  "description": "Updated: One hour legal consultation for all types of cases"
}
```

**Response (200):**
```json
{
  "message": "Service updated successfully",
  "service": {
    "_id": "69ad9f2a3b8743a56e89d8ae",
    "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
    "service_name": "Legal Consultation",
    "description": "Updated: One hour legal consultation for all types of cases",
    "price": 2000,
    "duration": "1 hour",
    "createdAt": "2026-03-08T16:15:22.297Z",
    "updatedAt": "2026-03-08T16:20:45.519Z"
  }
}
```

---

### 3.4 Delete Service
**DELETE** `/api/services/:id`

**Headers:**
```
Authorization: Bearer {lawyer_token}
```

**Response (200):**
```json
{
  "message": "Service deleted successfully"
}
```

---

### 3.5 Get Services by Lawyer (Public)
**GET** `/api/services/lawyer/:lawyerId`

**No Authentication Required**

**Response (200):**
```json
{
  "services": [
    {
      "_id": "69ad9f2a3b8743a56e89d8ae",
      "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
      "service_name": "Legal Consultation",
      "description": "One hour legal consultation for criminal cases",
      "price": 1500,
      "duration": "1 hour",
      "createdAt": "2026-03-08T16:15:22.297Z",
      "updatedAt": "2026-03-08T16:15:22.297Z"
    }
  ]
}
```

---

## 4. PUBLIC APIs (No Authentication)

### 4.1 Get All Lawyers with Services
**GET** `/api/public/lawyers/all`

**No Authentication Required**

**Response (200):**
```json
{
  "lawyers": [
    {
      "_id": "69ad9b3b2a8743a56e89d8ad",
      "full_name": "Rajesh Kumar",
      "mobile_number": "9876543210",
      "email": "rajesh@lawyer.com",
      "bar_council_number": "BAR12345",
      "bar_council_state": "Delhi",
      "years_of_experience": 5,
      "specialization": "Criminal Law",
      "classification": "Criminal",
      "sub_classification": "Property Law",
      "office_address": "123 Court Road",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "bar_enrollment_date": "2018-06-15T00:00:00.000Z",
      "court_practice": "High Court",
      "law_degree": "LLB",
      "university_name": "Delhi University",
      "graduation_year": 2017,
      "about_lawyer": "Experienced criminal lawyer with 5 years of practice",
      "languages_spoken": ["Hindi", "English", "Punjabi"],
      "consultation_fee": 2000,
      "availability_time": "Mon-Fri: 10AM-6PM",
      "office_latitude": 28.6139,
      "office_longitude": 77.2090,
      "isActive": true,
      "createdAt": "2026-03-08T15:52:27.297Z",
      "updatedAt": "2026-03-08T16:10:15.519Z",
      "services": [
        {
          "_id": "69ad9f2a3b8743a56e89d8ae",
          "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
          "service_name": "Legal Consultation",
          "description": "One hour legal consultation for criminal cases",
          "price": 1500,
          "duration": "1 hour",
          "createdAt": "2026-03-08T16:15:22.297Z",
          "updatedAt": "2026-03-08T16:15:22.297Z"
        },
        {
          "_id": "69ad9f5c4c8743a56e89d8af",
          "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
          "service_name": "Court Representation",
          "description": "Full court representation for criminal cases",
          "price": 25000,
          "duration": "Per case",
          "createdAt": "2026-03-08T16:16:10.297Z",
          "updatedAt": "2026-03-08T16:16:10.297Z"
        }
      ]
    }
  ]
}
```

---

### 4.2 Get Single Lawyer with Services
**GET** `/api/public/lawyers/:id`

**No Authentication Required**

**Response (200):**
```json
{
  "lawyer": {
    "_id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh@lawyer.com",
    "bar_council_number": "BAR12345",
    "bar_council_state": "Delhi",
    "years_of_experience": 5,
    "specialization": "Criminal Law",
    "classification": "Criminal",
    "sub_classification": "Property Law",
    "office_address": "123 Court Road",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "bar_enrollment_date": "2018-06-15T00:00:00.000Z",
    "court_practice": "High Court",
    "law_degree": "LLB",
    "university_name": "Delhi University",
    "graduation_year": 2017,
    "about_lawyer": "Experienced criminal lawyer with 5 years of practice",
    "languages_spoken": ["Hindi", "English", "Punjabi"],
    "consultation_fee": 2000,
    "availability_time": "Mon-Fri: 10AM-6PM",
    "office_latitude": 28.6139,
    "office_longitude": 77.2090,
    "isActive": true,
    "createdAt": "2026-03-08T15:52:27.297Z",
    "updatedAt": "2026-03-08T16:10:15.519Z",
    "services": [
      {
        "_id": "69ad9f2a3b8743a56e89d8ae",
        "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
        "service_name": "Legal Consultation",
        "description": "One hour legal consultation for criminal cases",
        "price": 1500,
        "duration": "1 hour",
        "createdAt": "2026-03-08T16:15:22.297Z",
        "updatedAt": "2026-03-08T16:15:22.297Z"
      }
    ]
  }
}
```

---

## 5. ADMIN - LAWYER MANAGEMENT APIs

### 5.1 Get All Lawyers (Admin)
**GET** `/api/lawyers/all`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "lawyers": [
    {
      "_id": "69ad9b3b2a8743a56e89d8ad",
      "full_name": "Rajesh Kumar",
      "mobile_number": "9876543210",
      "email": "rajesh@lawyer.com",
      "bar_council_number": "BAR12345",
      "bar_council_state": "Delhi",
      "years_of_experience": 5,
      "specialization": "Criminal Law",
      "classification": "Criminal",
      "sub_classification": "Property Law",
      "office_address": "123 Court Road",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "about_lawyer": "Experienced criminal lawyer",
      "languages_spoken": ["Hindi", "English"],
      "consultation_fee": 2000,
      "isActive": true,
      "createdAt": "2026-03-08T15:52:27.297Z",
      "updatedAt": "2026-03-08T15:52:49.519Z"
    }
  ]
}
```

---

### 5.2 Update Lawyer by Admin
**PUT** `/api/lawyers/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "consultation_fee": 3000,
  "isActive": true
}
```

**Response (200):**
```json
{
  "message": "Lawyer updated successfully",
  "lawyer": {
    "_id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "consultation_fee": 3000,
    "isActive": true,
    "updatedAt": "2026-03-08T16:25:30.220Z"
  }
}
```

---

### 5.3 Toggle Lawyer Status
**PATCH** `/api/lawyers/:id/status`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body (Deactivate):**
```json
{
  "isActive": false
}
```

**Response (200):**
```json
{
  "message": "Lawyer deactivated successfully",
  "lawyer": {
    "_id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "isActive": false,
    "updatedAt": "2026-03-08T16:26:15.673Z"
  }
}
```

**Request Body (Activate):**
```json
{
  "isActive": true
}
```

**Response (200):**
```json
{
  "message": "Lawyer activated successfully",
  "lawyer": {
    "_id": "69ad9b3b2a8743a56e89d8ad",
    "full_name": "Rajesh Kumar",
    "isActive": true,
    "updatedAt": "2026-03-08T16:26:45.386Z"
  }
}
```

---

### 5.4 Delete Lawyer
**DELETE** `/api/lawyers/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "message": "Lawyer deleted successfully"
}
```

---

### 5.5 Get All Lawyers with Services (Admin)
**GET** `/api/services/admin/all-lawyers-services`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "lawyers": [
    {
      "_id": "69ad9b3b2a8743a56e89d8ad",
      "full_name": "Rajesh Kumar",
      "mobile_number": "9876543210",
      "email": "rajesh@lawyer.com",
      "bar_council_number": "BAR12345",
      "bar_council_state": "Delhi",
      "years_of_experience": 5,
      "specialization": "Criminal Law",
      "classification": "Criminal",
      "office_address": "123 Court Road",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "isActive": true,
      "services": [
        {
          "_id": "69ad9f2a3b8743a56e89d8ae",
          "lawyer_id": "69ad9b3b2a8743a56e89d8ad",
          "service_name": "Legal Consultation",
          "description": "One hour legal consultation",
          "price": 1500,
          "duration": "1 hour"
        }
      ]
    }
  ]
}
```

---

## 6. HEALTH CHECK APIs

### 6.1 Root Endpoint
**GET** `/`

**Response (200):**
```
✅ API is running...
```

---

### 6.2 Health Check
**GET** `/health`

**Response (200):**
```json
{
  "status": "OK",
  "time": "2026-03-08T16:30:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "All required fields must be provided"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "error": "jwt expired"
}
```

### 404 Not Found
```json
{
  "message": "Lawyer not found"
}
```

### 409 Conflict
```json
{
  "message": "Lawyer already exists with this mobile, email or bar council number"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Summary

**Total APIs: 22**
- Admin: 4
- Lawyer: 4
- Services: 5
- Public: 2
- Admin Management: 5
- Health: 2

**Authentication:**
- JWT tokens with 12-hour expiry
- Separate tokens for Admin and Lawyer
- Bearer token in Authorization header

**Models:**
- Admin (3 fields)
- Lawyer (30+ fields)
- Service (5 fields)

**Port:** 5001
**Database:** MongoDB Atlas
