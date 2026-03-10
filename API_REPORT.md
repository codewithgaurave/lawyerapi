# Lawyer App API - Complete Report

## Total APIs: 22

---

## 1. Admin APIs (4 APIs)

### Authentication & Management
1. **POST** `/api/admin/create` - Create new admin
2. **POST** `/api/admin/login` - Admin login
3. **GET** `/api/admin/list` - List all admins (Protected)
4. **POST** `/api/admin/logout-all` - Logout from all sessions (Protected)

---

## 2. Lawyer APIs (4 APIs)

### Authentication & Profile
5. **POST** `/api/lawyers/register` - Register new lawyer
6. **POST** `/api/lawyers/login` - Lawyer login
7. **GET** `/api/lawyers/profile` - Get lawyer profile (Protected)
8. **PUT** `/api/lawyers/profile` - Update lawyer profile (Protected)

---

## 3. Service APIs (5 APIs)

### Lawyer Service Management
9. **POST** `/api/services` - Add new service (Protected - Lawyer)
10. **GET** `/api/services/my-services` - Get my services (Protected - Lawyer)
11. **PUT** `/api/services/:id` - Update service (Protected - Lawyer)
12. **DELETE** `/api/services/:id` - Delete service (Protected - Lawyer)
13. **GET** `/api/services/lawyer/:lawyerId` - Get services by lawyer ID (Public)

---

## 4. Public APIs (2 APIs)

### Public Access (No Authentication)
14. **GET** `/api/public/lawyers/all` - Get all active lawyers with services
15. **GET** `/api/public/lawyers/:id` - Get single lawyer with services

---

## 5. Admin - Lawyer Management APIs (5 APIs)

### Admin Controls for Lawyers
16. **GET** `/api/lawyers/all` - Get all lawyers (Protected - Admin)
17. **PUT** `/api/lawyers/:id` - Update lawyer by admin (Protected - Admin)
18. **PATCH** `/api/lawyers/:id/status` - Toggle lawyer active/inactive (Protected - Admin)
19. **DELETE** `/api/lawyers/:id` - Delete lawyer (Protected - Admin)
20. **GET** `/api/services/admin/all-lawyers-services` - Get all lawyers with services (Protected - Admin)

---

## 6. Health Check APIs (2 APIs)

### Server Health
21. **GET** `/` - Root endpoint
22. **GET** `/health` - Health check endpoint

---

## Models Created (3)

1. **Admin Model** - Admin authentication and management
2. **Lawyer Model** - Lawyer profile with 30+ fields
3. **Service Model** - Lawyer services

---

## Middleware Created (2)

1. **adminAuth.js** - Admin authentication middleware
2. **lawyerAuth.js** - Lawyer authentication middleware

---

## Features Implemented

### Authentication
- JWT based authentication
- Password hashing with bcrypt
- Token version management
- Separate auth for Admin and Lawyer

### Lawyer Registration
**Required Fields:**
- full_name
- mobile_number
- email
- password
- bar_council_number
- bar_council_state
- years_of_experience
- specialization
- classification (Criminal/Civil)
- office_address
- city
- state
- pincode

**Optional Fields (Profile Update):**
- sub_classification
- bar_enrollment_date
- court_practice
- law_degree
- university_name
- graduation_year
- license_document
- bar_council_certificate
- about_lawyer
- languages_spoken
- consultation_fee
- availability_time
- office_latitude
- office_longitude

### Service Management
- Lawyers can add/edit/delete their services
- Services include: name, description, price, duration
- Public can view services by lawyer
- Admin can view all lawyers with services

### Admin Controls
- View all lawyers
- Edit any lawyer profile
- Activate/Deactivate lawyers
- Delete lawyers
- View all services

### Public Access
- View all active lawyers with complete profile
- View individual lawyer details with services
- No authentication required

---

## Postman Collection

**Collection Name:** Lawyer App API
**Total Requests:** 20 (excluding health checks)

**Folders:**
1. Admin (4 requests)
2. Lawyer (4 requests)
3. Services (5 requests)
4. Public APIs (2 requests)
5. Admin - Lawyer Management (5 requests)

**Variables:**
- admin_token
- lawyer_token
- lawyer_id
- service_id

---

## Database Collections

1. **admins** - Admin users
2. **lawyers** - Lawyer profiles
3. **services** - Lawyer services

---

## Security Features

- JWT authentication
- Password hashing (bcrypt with 12 rounds)
- Token expiry (12 hours)
- Rate limiting on login endpoints
- CORS enabled
- Helmet security headers
- Protected routes with middleware

---

## Server Configuration

- **Port:** 5001
- **Database:** MongoDB Atlas
- **Environment:** Node.js with ES6 modules
- **Framework:** Express.js

---

## Status: ✅ All APIs Working & Tested
