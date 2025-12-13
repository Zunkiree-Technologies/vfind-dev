# V-Find API Documentation

## Overview

V-Find uses **Xano** as its Backend-as-a-Service (BaaS) platform. All API calls are made to Xano endpoints which handle database operations, authentication, and business logic.

**Base URL:** `https://x76o-gnx4-xrav.a2.xano.io`

---

## Authentication

### Authentication Method

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <authToken>
```

### Token Management

- Tokens are obtained after successful login
- Tokens expire after 7 days
- Tokens are stored in cookies (primary) and localStorage (backup)

---

## API Endpoints

## 1. Authentication APIs

### 1.1 User Login

Authenticates a user and returns an auth token.

**Endpoint:** `POST /api:0zPratjM/auth/login`

**Environment Variable:** `NEXT_PUBLIC_LOGIN_ENDPOINT`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Success Response (200):**
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "role": "Nurse"
  }
}
```

**Error Responses:**
| Code | Description |
|------|-------------|
| 401 | Invalid credentials |
| 400 | Missing required fields |

**Usage Example:**
```typescript
const response = await fetch(process.env.NEXT_PUBLIC_LOGIN_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

const { authToken, user } = await response.json();
```

---

### 1.2 Get Current User

Retrieves the currently authenticated user's information.

**Endpoint:** `GET /api:YhrHeNAH/auth/me`

**Environment Variable:** `NEXT_PUBLIC_AUTH_ENDPOINT`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Success Response (200):**
```json
{
  "id": 123,
  "email": "nurse@example.com",
  "fullName": "Jane Smith",
  "role": "Nurse",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Error Responses:**
| Code | Description |
|------|-------------|
| 401 | Invalid or expired token |

---

## 2. Nurse APIs

### 2.1 Nurse Registration (Onboarding)

Registers a new nurse with comprehensive profile information.

**Endpoint:** `POST /api:YhrHeNAH/nurse_onboarding`

**Environment Variable:** `NEXT_PUBLIC_XANO_ENDPOINT`

**Content-Type:** `multipart/form-data`

**Request Body (FormData):**
```
fullName: "Jane Smith"
email: "jane@example.com"
phone: "12345678"
password: "securepassword"
confirmPassword: "securepassword"
postcode: "2000"
currentResidentialLocation: "Sydney"
jobTypes: "Registered Nurse"
openToOtherTypes: "Yes"
shiftPreferences: ["Day Shift", "Afternoon Shift"]
startTime: "Immediately"
startDate: ""
jobSearchStatus: "Actively looking"
qualification: "Bachelor of Nursing"
otherQualification: ""
workingInHealthcare: "Yes"
experience: "4 years"
organisation: "Sydney Hospital"
locationPreference: "Specific locations"
preferredLocations: ["Sydney CBD", "North Sydney"]
certifications: ["First Aid", "CPR"]
residencyStatus: "Australian Citizen"
visaType: ""
visaDuration: ""
workHoursRestricted: "No, I can work full-time"
maxWorkHours: ""
termsAccepted: true
visibilityStatus: "visibleToAll"
photoIdFile: <File> (optional)
```

**Success Response (200):**
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 456,
    "email": "jane@example.com",
    "fullName": "Jane Smith"
  }
}
```

**Error Responses:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | "Email already exists" | Email is registered |
| 400 | "Phone number already exists" | Phone is registered |
| 422 | Validation errors | Missing required fields |

**Validation Rules:**
- Email: Unique, valid format
- Phone: 8 digits, unique
- Postcode: 4 digits
- Full Name: First and last name required
- Terms: Must be accepted

---

### 2.2 Get Nurse Profile

Retrieves the authenticated nurse's profile.

**Endpoint:** `GET /api:YhrHeNAH/nurse_profile`

**Environment Variable:** `NEXT_PUBLIC_NURSE_PROFILE_ENDPOINT`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Success Response (200):**
```json
{
  "id": 456,
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "12345678",
  "postcode": "2000",
  "qualification": "Bachelor of Nursing",
  "experience": "4 years",
  "certifications": ["First Aid", "CPR"],
  "shiftPreferences": ["Day Shift"],
  "preferredLocations": ["Sydney CBD"],
  "visibilityStatus": "visibleToAll",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

### 2.3 Update Nurse Profile

Updates the authenticated nurse's profile information.

**Endpoint:** `PATCH /api:YhrHeNAH/nurse_profile`

**Headers:**
```
Authorization: Bearer <authToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Jane Smith Updated",
  "shiftPreferences": ["Day Shift", "Night Shift"],
  "preferredLocations": ["Sydney CBD", "Parramatta"]
}
```

**Success Response (200):**
```json
{
  "id": 456,
  "fullName": "Jane Smith Updated",
  "...": "updated fields"
}
```

---

## 3. Employer APIs

### 3.1 Employer Registration (Onboarding)

Registers a new employer/company.

**Endpoint:** `POST /api:5OnHwV4U/employerOnboarding`

**Environment Variable:** `NEXT_PUBLIC_XANO_REGISTRATION_ENDPOINT`

**Request Body:**
```json
{
  "fullName": "John Manager",
  "email": "john@hospital.com",
  "mobile": "0412345678",
  "company": "Sydney Hospital",
  "companyName": "Sydney Hospital Pty Ltd",
  "password": "securepassword"
}
```

**Success Response (200):**
```json
{
  "id": 789,
  "email": "john@hospital.com",
  "company": "Sydney Hospital",
  "message": "Registration successful. Please verify your email."
}
```

---

### 3.2 Send OTP (Employer Signup)

Sends a one-time password to the employer's email for verification.

**Endpoint:** `POST /api:t5TlTxto/otp_employer_for_signUp`

**Environment Variable:** `NEXT_PUBLIC_SEND_OTP_ENDPOINT`

**Request Body:**
```json
{
  "email": "john@hospital.com"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent successfully",
  "expires_in": 300
}
```

---

### 3.3 Verify OTP (Employer Signup)

Verifies the OTP entered by the employer.

**Endpoint:** `POST /api:0zPratjM/verify_otp_for_employerSignUp`

**Environment Variable:** `NEXT_PUBLIC_VERIFY_OTP_ENDPOINT`

**Request Body:**
```json
{
  "email": "john@hospital.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "verified": true,
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 789,
    "email": "john@hospital.com"
  }
}
```

**Error Responses:**
| Code | Description |
|------|-------------|
| 400 | Invalid OTP |
| 410 | OTP expired |

---

### 3.4 Get Employer Profile

Retrieves the authenticated employer's profile.

**Endpoint:** `GET /api:t5TlTxto/get_employer_profile`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Success Response (200):**
```json
{
  "data": {
    "id": 789,
    "fullName": "John Manager",
    "email": "john@hospital.com",
    "mobile": "0412345678",
    "company": "Sydney Hospital",
    "companyName": "Sydney Hospital Pty Ltd"
  }
}
```

---

## 4. Job APIs

### 4.1 Create Job Posting

Creates a new job posting.

**Endpoint:** `POST /api:W58sMfI8/jobs`

**Environment Variable:** `NEXT_PUBLIC_XANO_JOB_POST_ENDPOINT`

**Headers:**
```
Authorization: Bearer <authToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Registered Nurse - ICU",
  "location": "Sydney",
  "locality": "Sydney CBD",
  "type": "Full-time",
  "minPay": "70000",
  "maxPay": "90000",
  "description": "<p>Job description with rich text...</p>",
  "roleCategory": "Registered Nurse",
  "experienceMin": "2",
  "experienceMax": "5",
  "certifications": ["ICU Certification", "ACLS"],
  "expiryDate": "2025-03-15T00:00:00Z",
  "status": "Active"
}
```

**Success Response (201):**
```json
{
  "id": 101,
  "title": "Registered Nurse - ICU",
  "created_at": "2025-01-15T10:30:00Z",
  "status": "Active"
}
```

---

### 4.2 Get Job Details (Employer's Jobs)

Retrieves all jobs posted by the authenticated employer.

**Endpoint:** `GET /api:W58sMfI8/get_job_details`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Success Response (200):**
```json
[
  {
    "id": 101,
    "title": "Registered Nurse - ICU",
    "location": "Sydney",
    "type": "Full-time",
    "minPay": "70000",
    "maxPay": "90000",
    "status": "Active",
    "expiryDate": "2025-03-15T00:00:00Z",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  },
  {
    "id": 102,
    "title": "Enrolled Nurse - Aged Care",
    "...": "..."
  }
]
```

---

### 4.3 Update Job Posting

Updates an existing job posting.

**Endpoint:** `PATCH /api:W58sMfI8/jobs/{job_id}`

**Headers:**
```
Authorization: Bearer <authToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior Registered Nurse - ICU",
  "maxPay": "95000"
}
```

**Success Response (200):**
```json
{
  "id": 101,
  "title": "Senior Registered Nurse - ICU",
  "maxPay": "95000",
  "updated_at": "2025-01-16T10:30:00Z"
}
```

---

### 4.4 Delete Job Posting

Deletes a job posting.

**Endpoint:** `DELETE /api:W58sMfI8/jobs/{job_id}`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Success Response (200):**
```json
{
  "message": "Job deleted successfully"
}
```

---

### 4.5 Pause/Resume Job

Toggles the job status between Active and Paused.

**Endpoint:** `POST /api:W58sMfI8/pause_active_job`

**Headers:**
```
Authorization: Bearer <authToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobs_id": 101
}
```

**Success Response (200):**
```json
{
  "result1": {
    "id": 101,
    "status": "Paused"
  }
}
```

---

### 4.6 Get Job Applicants

Retrieves all nurses who applied to a specific job.

**Endpoint:** `GET /api:PX2mK6Kr/getAllNursesAppliedForJob`

**Query Parameters:**
- `job_id` (required): The job ID

**Headers:**
```
Authorization: Bearer <authToken>
```

**Example:** `GET /api:PX2mK6Kr/getAllNursesAppliedForJob?job_id=101`

**Success Response (200):**
```json
[
  {
    "id": 1001,
    "nurse_id": 456,
    "job_id": 101,
    "applied_at": "2025-01-16T10:30:00Z",
    "nurse": {
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "qualification": "Bachelor of Nursing"
    }
  }
]
```

---

## 5. Company Profile APIs

### 5.1 Create Company Profile

Creates a company "About" section.

**Endpoint:** `POST /api:dttXPFU4/about_company`

**Headers:**
```
Authorization: Bearer <authToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "about_company": "Sydney Hospital is a leading healthcare provider..."
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "about_company": "Sydney Hospital is a leading healthcare provider...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

### 5.2 Get Company Profile

Retrieves the authenticated employer's company profile.

**Endpoint:** `GET /api:dttXPFU4/get_about_company`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Success Response (200):**
```json
{
  "id": 1,
  "about_company": "Sydney Hospital is a leading healthcare provider...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

### 5.3 Update Company Profile

Updates the company "About" section.

**Endpoint:** `PATCH /api:dttXPFU4/about_company`

**Headers:**
```
Authorization: Bearer <authToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "about_company": "Updated company description..."
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "about_company": "Updated company description...",
  "updated_at": "2025-01-16T10:30:00Z"
}
```

---

### 5.4 Delete Company Profile

Deletes the company profile.

**Endpoint:** `DELETE /api:dttXPFU4/about_company`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Success Response (200):**
```json
{
  "message": "Company profile deleted successfully"
}
```

---

## Environment Variables Reference

```bash
# Nurse onboarding/registration
NEXT_PUBLIC_XANO_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/nurse_onboarding

# User login (both Nurse and Employer)
NEXT_PUBLIC_LOGIN_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/auth/login

# Get current authenticated user
NEXT_PUBLIC_AUTH_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/auth/me

# Nurse profile operations
NEXT_PUBLIC_NURSE_PROFILE_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/nurse_profile

# Employer registration
NEXT_PUBLIC_XANO_REGISTRATION_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:5OnHwV4U/employerOnboarding

# Job CRUD operations
NEXT_PUBLIC_XANO_JOB_POST_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/jobs

# Send OTP for employer verification
NEXT_PUBLIC_SEND_OTP_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/otp_employer_for_signUp

# Verify OTP for employer signup
NEXT_PUBLIC_VERIFY_OTP_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/verify_otp_for_employerSignUp

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Additional Discovered Endpoints

These endpoints were found in the codebase but not defined in `.env.example`:

| Endpoint | Purpose | Used In |
|----------|---------|---------|
| `/api:t5TlTxto/get_employer_profile` | Get employer profile | EmployerDashboard |
| `/api:dttXPFU4/about_company` | Company profile CRUD | EmployerDashboard |
| `/api:dttXPFU4/get_about_company` | Get company profile | EmployerDashboard |
| `/api:PX2mK6Kr/getAllNursesAppliedForJob` | Get job applicants | EmployerDashboard |
| `/api:W58sMfI8/get_job_details` | Get employer's jobs | EmployerDashboard |
| `/api:W58sMfI8/pause_active_job` | Toggle job status | EmployerDashboard |

---

## Error Handling

### Standard Error Response Format

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {
    "field": "Additional context"
  }
}
```

### Common Error Codes

| HTTP Code | Error Type | Description |
|-----------|------------|-------------|
| 400 | Bad Request | Invalid request body or parameters |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 422 | Validation Error | Failed field validation |
| 500 | Server Error | Internal server error |

### Error Handling Pattern

```typescript
try {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();

    switch (response.status) {
      case 400:
        throw new Error(errorData.message || "Invalid request");
      case 401:
        // Redirect to login
        router.push("/signin");
        throw new Error("Please log in");
      case 409:
        throw new Error("This email is already registered");
      default:
        throw new Error("An error occurred");
    }
  }

  return await response.json();
} catch (error) {
  console.error("API Error:", error);
  alert(error.message);
}
```

---

## Rate Limiting

Xano may implement rate limiting. Standard limits:
- 100 requests per minute per IP (unauthenticated)
- 1000 requests per minute per user (authenticated)

Handle rate limiting with exponential backoff:

```typescript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }

    return response;
  }
  throw new Error("Max retries exceeded");
}
```

---

## Image/File Storage

### Xano CDN Domains

Files uploaded to Xano are served from these domains:

```
x8ki-letl-twmt.n7.xano.io
x76o-gnx4-xrav.a2.xano.io
```

These are configured in `next.config.ts` for Next.js Image optimization.

### File Upload Pattern

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type - browser sets it with boundary
    },
    body: formData,
  });

  return await response.json();
};
```

---

## Postman Collection

For testing APIs, import this collection structure:

```
V-Find API
├── Auth
│   ├── Login
│   └── Get Current User
├── Nurse
│   ├── Register
│   ├── Get Profile
│   └── Update Profile
├── Employer
│   ├── Register
│   ├── Send OTP
│   ├── Verify OTP
│   └── Get Profile
├── Jobs
│   ├── Create Job
│   ├── Get Jobs
│   ├── Update Job
│   ├── Delete Job
│   └── Pause/Resume Job
└── Company
    ├── Create Profile
    ├── Get Profile
    ├── Update Profile
    └── Delete Profile
```

---

**Document Version:** 1.0
**Last Updated:** December 2025
