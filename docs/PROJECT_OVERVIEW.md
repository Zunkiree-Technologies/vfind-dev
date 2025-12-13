# V-Find Project Overview

## Executive Summary

**V-Find** is a modern healthcare job matching platform designed to connect healthcare professionals (primarily nurses) with healthcare employers across Australia. The platform streamlines the job search and hiring process through intelligent matching, comprehensive profiles, and seamless communication.

---

## Vision & Mission

### Vision
To become Australia's leading healthcare recruitment platform, making it effortless for healthcare professionals to find meaningful work and for employers to discover qualified talent.

### Mission
- Simplify the healthcare job search experience
- Reduce time-to-hire for healthcare organizations
- Provide transparent job matching based on qualifications, preferences, and location
- Build a trusted community of healthcare professionals and employers

---

## Problem Statement

### For Nurses
- Difficulty finding jobs that match their specific qualifications and certifications
- Lack of transparency in job requirements and compensation
- Time-consuming application processes
- Limited visibility into employer quality and workplace culture

### For Employers
- Challenge in finding qualified nursing candidates quickly
- High recruitment costs through traditional agencies
- Difficulty verifying candidate qualifications
- Managing multiple job postings and applicants

### V-Find Solution
A unified platform where nurses create comprehensive profiles showcasing their qualifications, and employers post detailed job requirements, enabling intelligent matching and streamlined hiring.

---

## Target Users

### 1. Nurses (Healthcare Professionals)
**Demographics:**
- Registered Nurses (RNs)
- Enrolled Nurses (ENs)
- Nurse Practitioners
- Healthcare assistants
- Allied health professionals

**Needs:**
- Find jobs matching their qualifications
- Flexible work arrangements (full-time, part-time, casual)
- Location-based job search
- Easy application process
- Track application status

### 2. Employers (Healthcare Organizations)
**Demographics:**
- Hospitals
- Aged care facilities
- Medical clinics
- Home care providers
- Healthcare staffing agencies

**Needs:**
- Post job openings quickly
- Access to qualified candidate pool
- Filter candidates by qualifications
- Manage applicants efficiently
- Build employer brand

### 3. Administrators
**Role:**
- Platform oversight
- User management
- Content moderation
- Analytics and reporting

---

## Core Features

### Nurse Features

| Feature | Description | Status |
|---------|-------------|--------|
| Multi-step Registration | 10-step wizard capturing qualifications, preferences, and experience | Implemented |
| Profile Management | Complete profile with certifications, experience, and preferences | Implemented |
| Job Search | Browse and filter available positions | Implemented |
| Job Applications | Apply to positions with one click | Implemented |
| Saved Jobs | Bookmark interesting positions | Implemented |
| Application Tracking | Monitor application status | Implemented |
| Google OAuth | Quick registration/login via Google | Implemented |

### Employer Features

| Feature | Description | Status |
|---------|-------------|--------|
| Employer Onboarding | Company registration with OTP verification | Implemented |
| Company Profile | About section and company details | Implemented |
| Job Posting | Create detailed job listings with rich text | Implemented |
| Candidate Search | Browse and filter nurse profiles | Implemented |
| Applicant Management | View and manage job applicants | Implemented |
| Job Management | Edit, pause, resume, delete job postings | Implemented |
| Wishlist | Save interesting candidates | Implemented |

### Admin Features

| Feature | Description | Status |
|---------|-------------|--------|
| Dashboard | Overview of platform activity | Implemented |
| User Management | View and manage nurses and employers | Implemented |
| Connection Management | Monitor nurse-employer connections | Implemented |

### Platform Features

| Feature | Description | Status |
|---------|-------------|--------|
| Role-based Access | Separate portals for nurses and employers | Implemented |
| Secure Authentication | Cookie-based auth with middleware protection | Implemented |
| Multi-tab Session Sync | Logout detection across browser tabs | Implemented |
| Dark Mode | Theme toggle for user preference | Implemented |
| Responsive Design | Mobile-first responsive UI | Implemented |
| Location Services | Australian postcode-based job matching | Implemented |

---

## User Journeys

### Nurse Journey

```
1. DISCOVERY
   └── Lands on homepage → Views benefits → Clicks "Find Jobs"

2. REGISTRATION (10 Steps)
   ├── Step 1: Job Types (what roles they're seeking)
   ├── Step 2: Shift Preferences (day, night, rotating)
   ├── Step 3: Start Time (immediate, specific date)
   ├── Step 4: Job Search Status (actively looking, etc.)
   ├── Step 5: Qualifications (RN, EN, etc.)
   ├── Step 6: Experience (years, organizations)
   ├── Step 7: Location Preferences (suburbs, regions)
   ├── Step 8: Certifications (held certifications)
   ├── Step 9: Residency/Visa Status
   └── Step 10: Contact Details & Password

3. DASHBOARD
   └── View recommended jobs → Browse all jobs → Filter by criteria

4. APPLICATION
   └── View job details → Apply → Track status

5. PROFILE MANAGEMENT
   └── Update qualifications → Manage preferences → View connections
```

### Employer Journey

```
1. DISCOVERY
   └── Lands on homepage → Clicks "For Employers" → Views benefits

2. REGISTRATION
   ├── Enter company details
   ├── Verify email via OTP
   └── Complete profile

3. DASHBOARD
   ├── Complete company profile
   ├── View talent pool
   └── Post jobs

4. JOB MANAGEMENT
   ├── Create job posting (with rich text editor)
   ├── Preview job
   ├── Publish job
   └── Manage (edit, pause, delete)

5. CANDIDATE MANAGEMENT
   ├── View applicants per job
   ├── Search candidate pool
   ├── Save to wishlist
   └── Contact candidates
```

---

## Business Rules

### Registration Rules

| Rule | Description |
|------|-------------|
| Email Uniqueness | Each email can only be registered once per role |
| Phone Uniqueness | Phone numbers must be unique |
| Password Requirements | Minimum security standards enforced |
| Full Name Format | Must include first and last name |
| Australian Postcode | 4-digit postcode required |
| Terms Acceptance | Must accept terms to complete registration |

### Job Posting Rules

| Rule | Description |
|------|-------------|
| Required Fields | Title, location, type, pay range, description |
| Job Expiry | Jobs can have expiration dates |
| Status Management | Jobs can be Active or Paused |
| Employer Ownership | Only the posting employer can edit/delete |

### Application Rules

| Rule | Description |
|------|-------------|
| One Application | Nurses can apply once per job |
| Profile Required | Complete profile needed to apply |
| Visibility Control | Nurses can control profile visibility |

### Authentication Rules

| Rule | Description |
|------|-------------|
| Role Separation | Nurses and Employers have separate login paths |
| Session Duration | Auth tokens expire after 7 days |
| Route Protection | Dashboard routes require authentication |
| Cross-role Prevention | Nurses cannot access Employer routes (and vice versa) |

---

## Data Model Overview

### Core Entities

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Nurse    │     │     Job     │     │  Employer   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ fullName    │     │ title       │     │ fullName    │
│ email       │     │ location    │     │ email       │
│ phone       │     │ type        │     │ company     │
│ password    │     │ minPay      │     │ mobile      │
│ postcode    │     │ maxPay      │     │ companyName │
│ qualification│    │ description │     │ about       │
│ experience  │     │ employer_id │     └─────────────┘
│ certifications│   │ status      │
│ preferences │     │ expiryDate  │
└─────────────┘     └─────────────┘

        │                  │
        │    ┌─────────────┴─────────────┐
        │    │                           │
        ▼    ▼                           ▼
┌─────────────────┐              ┌─────────────────┐
│   Application   │              │   Connection    │
├─────────────────┤              ├─────────────────┤
│ nurse_id        │              │ nurse_id        │
│ job_id          │              │ employer_id     │
│ status          │              │ status          │
│ applied_at      │              │ created_at      │
└─────────────────┘              └─────────────────┘
```

---

## Current Status

### Completed (v0.1.0)
- Full nurse registration flow
- Employer onboarding with OTP
- Job posting and management
- Candidate search and filtering
- Application system
- Authentication and authorization
- Responsive UI design
- Dark mode support

### In Progress
- Admin route protection
- Enhanced analytics
- Notification system improvements

### Planned Features
- Real-time notifications
- In-app messaging
- Advanced matching algorithm
- Mobile app
- Payment integration
- Background checks integration
- Video interviewing

---

## Success Metrics

### Platform Health
- Number of registered nurses
- Number of registered employers
- Active job postings
- Applications submitted
- Successful placements

### User Engagement
- Daily/Monthly active users
- Profile completion rate
- Application-to-interview ratio
- Time to fill positions

### Technical Health
- Page load times
- API response times
- Error rates
- Uptime percentage

---

## Competitive Advantages

1. **Healthcare-Specific**: Purpose-built for nursing/healthcare recruitment
2. **Comprehensive Profiles**: Detailed qualification and preference capture
3. **Location Intelligence**: Australian postcode-based matching
4. **Modern Tech Stack**: Fast, responsive, and scalable architecture
5. **Free Job Posting**: Accessible to all healthcare employers
6. **Transparent Matching**: Clear job requirements and candidate qualifications

---

## Glossary

| Term | Definition |
|------|------------|
| RN | Registered Nurse |
| EN | Enrolled Nurse |
| Xano | Backend-as-a-Service platform used for APIs and database |
| OTP | One-Time Password for verification |
| Middleware | Server-side code that runs before page rendering |
| SSR | Server-Side Rendering |
| BaaS | Backend as a Service |

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Next Review:** Upon major feature release
