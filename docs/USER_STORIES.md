# V-Find User Stories

This document outlines the user stories, personas, and feature requirements for the V-Find healthcare job matching platform.

---

## User Personas

### Persona 1: Sarah - The Job-Seeking Nurse

**Demographics:**
- Age: 28
- Role: Registered Nurse (RN)
- Experience: 4 years
- Location: Sydney, Australia

**Goals:**
- Find a nursing job closer to home
- Better work-life balance with preferred shifts
- Competitive salary with growth opportunities

**Pain Points:**
- Current commute is too long
- Night shifts affecting health
- Limited visibility into job market
- Complex application processes

**Tech Comfort:** High - uses smartphone and laptop daily

---

### Persona 2: Michael - The Healthcare Recruiter

**Demographics:**
- Age: 35
- Role: HR Manager at Regional Hospital
- Experience: 8 years in healthcare recruitment

**Goals:**
- Fill nursing vacancies quickly
- Find qualified candidates with specific certifications
- Reduce recruitment costs
- Build talent pipeline

**Pain Points:**
- High turnover in nursing staff
- Expensive recruitment agencies
- Time-consuming screening process
- Difficulty verifying qualifications

**Tech Comfort:** Medium - uses standard office software

---

### Persona 3: Emily - The New Graduate Nurse

**Demographics:**
- Age: 23
- Role: Recently graduated EN
- Experience: Clinical placements only
- Location: Melbourne, Australia

**Goals:**
- Land first nursing job
- Gain experience in preferred specialty
- Flexible hours while building experience

**Pain Points:**
- Lack of professional experience
- Uncertain about what roles to apply for
- Overwhelmed by job requirements
- No professional network yet

**Tech Comfort:** Very High - digital native

---

### Persona 4: David - The Aged Care Facility Manager

**Demographics:**
- Age: 45
- Role: Operations Manager at Aged Care Facility
- Managing: 50-bed facility

**Goals:**
- Maintain adequate staffing levels
- Find nurses with aged care experience
- Reduce agency staff costs
- Build reliable team

**Pain Points:**
- High staff turnover
- Last-minute shift coverage
- Budget constraints
- Competition with hospitals for talent

**Tech Comfort:** Medium

---

## User Stories by Role

## Nurse User Stories

### Registration & Onboarding (Progressive Signup Flow)

**Overview:** The signup flow uses a progressive profiling approach - quick account creation first, then profile completion in the dashboard. This maximizes conversion by capturing email early.

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| N-001 | As a nurse, I want to register with my email, name, and password so that I can quickly create an account | High | Implemented |
| N-002 | As a nurse, I want to sign up with Google so that I can register with one click | High | Implemented |
| N-003 | As a nurse, I want to see a welcome page after signup so that I feel welcomed | Medium | Implemented |
| N-004 | As a nurse, I want to see my profile completion progress so that I know what's missing | High | Implemented |
| N-005 | As a nurse, I want to complete my profile in sections so that I can do it at my own pace | High | Implemented |
| N-006 | As a nurse, I want to specify my job type preferences (RN, EN, etc.) so that I see relevant jobs | High | Implemented |
| N-007 | As a nurse, I want to indicate my shift preferences so that I find jobs matching my availability | High | Implemented |
| N-008 | As a nurse, I want to specify when I can start so that employers know my availability | High | Implemented |
| N-009 | As a nurse, I want to indicate my job search status so that employers understand my urgency | Medium | Implemented |
| N-010 | As a nurse, I want to enter my qualifications so that I'm matched with appropriate jobs | High | Implemented |
| N-011 | As a nurse, I want to add my work experience so that employers can see my background | High | Implemented |
| N-012 | As a nurse, I want to select preferred work locations so that I find jobs near me | High | Implemented |
| N-013 | As a nurse, I want to list my certifications so that I'm matched with jobs requiring them | High | Implemented |
| N-014 | As a nurse, I want to specify my residency/visa status so that employers know my work rights | High | Implemented |

### Authentication

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| N-015 | As a nurse, I want to log in with my email and password so that I can access my account | High | Implemented |
| N-016 | As a nurse, I want to reset my password if I forget it so that I can regain access | High | Implemented |
| N-017 | As a nurse, I want to stay logged in across sessions so that I don't have to log in every time | Medium | Implemented |
| N-018 | As a nurse, I want to log out securely so that my account is protected on shared devices | High | Implemented |

### Job Discovery

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| N-017 | As a nurse, I want to browse available jobs so that I can explore opportunities | High | Implemented |
| N-018 | As a nurse, I want to filter jobs by location so that I find jobs near me | High | Implemented |
| N-019 | As a nurse, I want to filter jobs by job type so that I see relevant positions | High | Implemented |
| N-020 | As a nurse, I want to filter jobs by salary range so that I find jobs meeting my expectations | Medium | Implemented |
| N-021 | As a nurse, I want to see job details so that I can make informed decisions | High | Implemented |
| N-022 | As a nurse, I want to see employer information so that I can research the company | Medium | Implemented |

### Job Applications

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| N-023 | As a nurse, I want to apply to jobs with one click so that the process is quick | High | Implemented |
| N-024 | As a nurse, I want to save jobs for later so that I can review them before applying | High | Implemented |
| N-025 | As a nurse, I want to view my applied jobs so that I can track my applications | High | Implemented |
| N-026 | As a nurse, I want to view my saved jobs so that I can access them easily | High | Implemented |
| N-027 | As a nurse, I want to see application status so that I know where I stand | Medium | Implemented |

### Profile Management

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| N-028 | As a nurse, I want to view my profile so that I can see how employers see me | High | Implemented |
| N-029 | As a nurse, I want to edit my profile so that I can keep information current | High | Implemented |
| N-030 | As a nurse, I want to control my profile visibility so that I can hide from certain employers | Medium | Implemented |
| N-031 | As a nurse, I want to upload my photo ID so that employers can verify my identity | Low | Implemented |

### Notifications

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| N-032 | As a nurse, I want to receive job alerts so that I don't miss opportunities | Medium | Partial |
| N-033 | As a nurse, I want to be notified when an employer views my profile so that I know there's interest | Low | Planned |

---

## Employer User Stories

### Registration & Onboarding

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E-001 | As an employer, I want to register my company so that I can post jobs | High | Implemented |
| E-002 | As an employer, I want to verify my email with OTP so that my account is secure | High | Implemented |
| E-003 | As an employer, I want to add company details so that nurses know about us | High | Implemented |
| E-004 | As an employer, I want to write a company description so that we attract talent | Medium | Implemented |

### Authentication

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E-005 | As an employer, I want to log in securely so that I can access my dashboard | High | Implemented |
| E-006 | As an employer, I want to reset my password so that I can regain access | High | Implemented |
| E-007 | As an employer, I want to stay logged in so that I don't have to log in repeatedly | Medium | Implemented |

### Job Management

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E-008 | As an employer, I want to post a job so that nurses can find it | High | Implemented |
| E-009 | As an employer, I want to use a rich text editor so that job descriptions look professional | Medium | Implemented |
| E-010 | As an employer, I want to specify job requirements so that I attract qualified candidates | High | Implemented |
| E-011 | As an employer, I want to set salary range so that candidates know the compensation | High | Implemented |
| E-012 | As an employer, I want to preview my job posting so that I can verify before publishing | Medium | Implemented |
| E-013 | As an employer, I want to edit my job postings so that I can update information | High | Implemented |
| E-014 | As an employer, I want to pause job postings so that I can stop applications temporarily | Medium | Implemented |
| E-015 | As an employer, I want to resume paused jobs so that I can restart hiring | Medium | Implemented |
| E-016 | As an employer, I want to delete job postings so that I can remove filled positions | High | Implemented |
| E-017 | As an employer, I want to set job expiry dates so that old postings are removed | Medium | Implemented |
| E-018 | As an employer, I want to see how many applicants each job has so that I can prioritize | High | Implemented |

### Candidate Management

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E-019 | As an employer, I want to view job applicants so that I can review candidates | High | Implemented |
| E-020 | As an employer, I want to browse the candidate pool so that I can find passive candidates | High | Implemented |
| E-021 | As an employer, I want to filter candidates by qualifications so that I find suitable matches | High | Implemented |
| E-022 | As an employer, I want to filter candidates by location so that I find local talent | Medium | Implemented |
| E-023 | As an employer, I want to save candidates to a wishlist so that I can review them later | Medium | Implemented |
| E-024 | As an employer, I want to view candidate profiles so that I can assess their fit | High | Implemented |

### Dashboard & Analytics

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E-025 | As an employer, I want a dashboard overview so that I can see my hiring activity | High | Implemented |
| E-026 | As an employer, I want to see job posting statistics so that I can measure performance | Medium | Partial |
| E-027 | As an employer, I want to see time remaining on job postings so that I can manage expiry | Medium | Implemented |

### Company Profile

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E-028 | As an employer, I want to create a company profile so that nurses learn about us | High | Implemented |
| E-029 | As an employer, I want to edit company description so that we keep info current | Medium | Implemented |
| E-030 | As an employer, I want to delete company profile so that I can start fresh | Low | Implemented |

---

## Admin User Stories

### User Management

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| A-001 | As an admin, I want to view all nurses so that I can manage the platform | High | Implemented |
| A-002 | As an admin, I want to view all employers so that I can manage accounts | High | Implemented |
| A-003 | As an admin, I want to view nurse details so that I can investigate issues | High | Implemented |
| A-004 | As an admin, I want to view employer details so that I can verify businesses | High | Implemented |
| A-005 | As an admin, I want to delete users so that I can remove bad actors | Medium | Implemented |

### Platform Management

| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| A-006 | As an admin, I want a dashboard overview so that I can monitor platform health | High | Implemented |
| A-007 | As an admin, I want to view connections so that I can see matching activity | Medium | Implemented |
| A-008 | As an admin, I want to access admin routes securely so that the platform is protected | High | Planned |

---

## Feature Requirements Matrix

### Nurse Features

| Feature | Must Have | Should Have | Nice to Have |
|---------|-----------|-------------|--------------|
| Quick Email Registration (3 fields) | X | | |
| Google OAuth | X | | |
| Welcome Page After Signup | | X | |
| Profile Completion Widget | X | | |
| Progressive Profile Builder | X | | |
| Job Search | X | | |
| Job Filters | X | | |
| One-Click Apply | X | | |
| Save Jobs | | X | |
| Application Tracking | | X | |
| Profile Management | X | | |
| Profile Visibility Control | | X | |
| Password Reset | X | | |
| Push Notifications | | | X |
| In-App Messaging | | | X |

### Employer Features

| Feature | Must Have | Should Have | Nice to Have |
|---------|-----------|-------------|--------------|
| Company Registration | X | | |
| OTP Verification | X | | |
| Job Posting | X | | |
| Rich Text Editor | | X | |
| Job Management (CRUD) | X | | |
| Pause/Resume Jobs | | X | |
| View Applicants | X | | |
| Candidate Search | X | | |
| Candidate Filters | | X | |
| Wishlist | | X | |
| Company Profile | | X | |
| Analytics Dashboard | | | X |
| Bulk Actions | | | X |

### Platform Features

| Feature | Must Have | Should Have | Nice to Have |
|---------|-----------|-------------|--------------|
| Role-Based Auth | X | | |
| Route Protection | X | | |
| Secure Cookies | X | | |
| Multi-Tab Sync | | X | |
| Dark Mode | | | X |
| Responsive Design | X | | |
| Admin Dashboard | | X | |
| Email Notifications | | X | |
| Real-Time Updates | | | X |

---

## User Journey Maps

### Nurse Registration Journey (Progressive Signup)

```
┌─────────────────────────────────────────────────────────────────┐
│            NURSE REGISTRATION JOURNEY (PROGRESSIVE)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AWARENESS                                                       │
│  └── Discovers V-Find via search/referral/social media          │
│                                                                  │
│  CONSIDERATION                                                   │
│  ├── Visits homepage                                             │
│  ├── Reads benefits section                                      │
│  ├── Views featured jobs                                         │
│  └── Decides to sign up                                          │
│                                                                  │
│  QUICK REGISTRATION (< 60 seconds)                               │
│  ├── Clicks "Find Jobs" / "Sign Up"                              │
│  ├── Option A: Clicks "Sign up with Google" (1-click)            │
│  └── Option B: Enters Full Name, Email, Password                 │
│      ├── Accepts Terms & Privacy Policy                          │
│      └── Clicks "Create Account"                                 │
│                                                                  │
│  WELCOME & ONBOARDING                                            │
│  ├── Sees welcome celebration page                               │
│  ├── "Yay, [Name]! Welcome aboard!"                              │
│  ├── Option: "Complete My Profile" (recommended)                 │
│  └── Option: "Skip for now" → Dashboard                          │
│                                                                  │
│  PROGRESSIVE PROFILE COMPLETION (In Dashboard)                   │
│  ├── Sees Profile Completion Widget (0% → 100%)                  │
│  ├── Completes sections at own pace:                             │
│  │   ├── Basic Info (phone, postcode, location)                  │
│  │   ├── Qualifications (RN/EN, experience)                      │
│  │   ├── Work Preferences (job types, shifts, start date)        │
│  │   ├── Location (preferred work areas)                         │
│  │   ├── Certifications (held certifications)                    │
│  │   └── Work Rights (visa/residency status)                     │
│  └── Progress saves automatically between sessions               │
│                                                                  │
│  ENGAGEMENT                                                      │
│  ├── Browses jobs immediately after signup                       │
│  ├── Prompted to complete profile when applying                  │
│  ├── Applies to jobs with one click                              │
│  └── Saves interesting positions                                 │
│                                                                  │
│  RETENTION                                                       │
│  ├── Returns to check application status                         │
│  ├── Updates profile as needed                                   │
│  ├── Receives job match notifications                            │
│  └── Continues applying to jobs                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Benefits of Progressive Signup:**
- Email captured immediately (enables recovery of abandoned signups)
- Users can browse jobs within 60 seconds
- Lower friction = higher conversion rates
- Profile completion is gamified with progress bar
- Users complete profile when motivated (e.g., when applying to jobs)

### Employer Hiring Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMPLOYER HIRING JOURNEY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AWARENESS                                                       │
│  └── Discovers V-Find or directed by management                 │
│                                                                  │
│  CONSIDERATION                                                   │
│  ├── Visits "For Employers" page                                 │
│  ├── Reviews platform benefits                                   │
│  └── Decides to register                                         │
│                                                                  │
│  REGISTRATION                                                    │
│  ├── Enters company details                                      │
│  ├── Receives OTP via email                                      │
│  ├── Verifies email                                              │
│  └── Account created                                             │
│                                                                  │
│  SETUP                                                           │
│  ├── Logs into dashboard                                         │
│  ├── Completes company profile                                   │
│  └── Writes company description                                  │
│                                                                  │
│  POSTING                                                         │
│  ├── Clicks "Post a Job"                                         │
│  ├── Fills job details                                           │
│  ├── Uses rich text for description                              │
│  ├── Sets requirements & salary                                  │
│  ├── Previews listing                                            │
│  └── Publishes job                                               │
│                                                                  │
│  SOURCING                                                        │
│  ├── Views incoming applicants                                   │
│  ├── Browses talent pool                                         │
│  ├── Filters by qualifications                                   │
│  └── Saves promising candidates                                  │
│                                                                  │
│  MANAGEMENT                                                      │
│  ├── Reviews applications                                        │
│  ├── Contacts candidates                                         │
│  ├── Pauses filled positions                                     │
│  └── Deletes old postings                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Acceptance Criteria Examples

### N-001: Quick Nurse Registration

**Given** I am a new nurse visitor
**When** I fill in Full Name, Email, Password and accept terms
**And** I click "Create Account"
**Then** my account should be created
**And** I should be redirected to the Welcome page
**And** I should see "Yay, [FirstName]! Welcome aboard!"

**Validation Rules:**
- Email must be unique and valid format
- Full name must include first and last name
- Password must be at least 6 characters
- Terms must be accepted

---

### N-004: Profile Completion Widget

**Given** I am a logged-in nurse with incomplete profile
**When** I view my dashboard
**Then** I should see a Profile Completion Widget
**And** It should show my completion percentage (0-100%)
**And** It should list sections with their completion status
**And** I should be able to click on incomplete sections to add information

---

### N-005: Progressive Profile Builder

**Given** I am a logged-in nurse completing my profile
**When** I click on a profile section (e.g., "Qualifications")
**Then** I should see the section form
**And** I should be able to fill in the required fields
**And** I should be able to save and continue
**And** My progress should be saved automatically
**And** The completion percentage should update

---

### E-008: Job Posting

**Given** I am a logged-in employer
**When** I fill in the job posting form with required fields
**And** I click publish
**Then** the job should be visible in the job listings
**And** the job should appear on my dashboard
**And** nurses should be able to view and apply

**Required Fields:**
- Job title
- Location
- Job type
- Salary range
- Description
- Experience requirements

---

## Future User Stories (Backlog)

### Phase 2 Features

| ID | User Story | Priority |
|----|------------|----------|
| F-001 | As a nurse, I want to receive push notifications for new matching jobs | Medium |
| F-002 | As an employer, I want to message candidates directly through the platform | High |
| F-003 | As a nurse, I want to schedule interviews through the platform | Medium |
| F-004 | As an employer, I want to run background checks on candidates | Low |
| F-005 | As a nurse, I want to upload and verify my certifications | Medium |
| F-006 | As an employer, I want to post multiple jobs with a template | Low |
| F-007 | As a platform, we need to implement payment for premium features | Medium |
| F-008 | As an admin, I want to generate reports on platform activity | Medium |

---

**Document Version:** 2.0
**Last Updated:** December 2025
**Change Log:**
- v2.0: Updated nurse signup flow from 10-step wizard to progressive signup (quick registration + profile completion in dashboard)
