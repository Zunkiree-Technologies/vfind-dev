# V-Find: Xano to Supabase Migration Plan

## Overview

This document outlines the complete migration of V-Find's backend from Xano (deleted) to Supabase.

**Migration Date:** December 2025
**Status:** In Progress

---

## Supabase Project Details

| Setting | Value |
|---------|-------|
| **Project Name** | v-find |
| **Region** | Asia-Pacific |
| **Project URL** | `https://wqiuzgxpnvulozbkveil.supabase.co` |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXV6Z3hwbnZ1bG96Ymt2ZWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzUxODksImV4cCI6MjA4MTA1MTE4OX0.Z3uEwZT2NB_M7CDVrreCxkdLT77oG4lsj9dIxKKx6Mg` |
| **Service Role Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXV6Z3hwbnZ1bG96Ymt2ZWlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3NTE4OSwiZXhwIjoyMDgxMDUxMTg5fQ.jSET7FgSr5QIQJPaKVfY7XS-5kPFeVHs0Ur9suAPAao` |

---

## Migration Scope

| Item | Count |
|------|-------|
| API Endpoints | 57 |
| Database Tables | 11 |
| Files to Modify | 30+ |
| Storage Buckets | 3 |

---

## Phase 1: Database Schema

### Tables to Create

Run these SQL commands in Supabase SQL Editor (Dashboard → SQL Editor → New Query):

#### 1. Nurses Table
```sql
CREATE TABLE nurses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE,
  postcode TEXT,
  current_residential_location TEXT,
  job_types TEXT[],
  open_to_other_types TEXT,
  shift_preferences TEXT[],
  start_time TEXT,
  start_date DATE,
  job_search_status TEXT,
  qualification TEXT,
  other_qualification TEXT,
  working_in_healthcare TEXT,
  experience TEXT,
  organisation TEXT,
  location_preference TEXT,
  preferred_locations TEXT[],
  certifications TEXT[],
  licenses TEXT[],
  residency_status TEXT,
  visa_type TEXT,
  visa_duration TEXT,
  work_hours_restricted TEXT,
  max_work_hours TEXT,
  visibility_status TEXT DEFAULT 'visibleToAll',
  profile_image_url TEXT,
  photo_id_url TEXT,
  terms_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX idx_nurses_email ON nurses(email);
```

#### 2. Employers Table
```sql
CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  mobile TEXT,
  company_name TEXT NOT NULL,
  australian_business_number TEXT,
  business_type TEXT,
  number_of_employees TEXT,
  your_designation TEXT,
  state TEXT,
  city TEXT,
  pin_code TEXT,
  company_address TEXT,
  organization_website TEXT,
  creating_account_as TEXT,
  logo_url TEXT,
  about_company TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX idx_employers_email ON employers(email);
```

#### 3. Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  locality TEXT,
  type TEXT NOT NULL,
  min_pay TEXT,
  max_pay TEXT,
  description TEXT,
  role_category TEXT,
  experience_min TEXT,
  experience_max TEXT,
  job_shift TEXT,
  certifications TEXT[],
  key_responsibilities TEXT,
  work_environment TEXT,
  status TEXT DEFAULT 'Active',
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
```

#### 4. Applications Table
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nurse_id, job_id)
);

-- Create indexes
CREATE INDEX idx_applications_nurse ON applications(nurse_id);
CREATE INDEX idx_applications_job ON applications(job_id);
```

#### 5. Saved Jobs Table (Nurse Wishlist)
```sql
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nurse_id, job_id)
);
```

#### 6. Employer Wishlist Table
```sql
CREATE TABLE employer_wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
  nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employer_id, nurse_id)
);
```

#### 7. Education Table
```sql
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree_name TEXT NOT NULL,
  from_year TEXT,
  to_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_education_nurse ON education(nurse_id);
```

#### 8. Work Experience Table
```sql
CREATE TABLE work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  total_years_of_experience TEXT,
  start_date TEXT,
  end_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_work_experience_nurse ON work_experience(nurse_id);
```

#### 9. Connections Table
```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
  nurse_id UUID REFERENCES nurses(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_connections_employer ON connections(employer_id);
CREATE INDEX idx_connections_nurse ON connections(nurse_id);
CREATE INDEX idx_connections_status ON connections(status);
```

#### 10. OTP Tokens Table
```sql
CREATE TABLE otp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_email ON otp_tokens(email);
```

#### 11. Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 2: Storage Buckets

Create these in Supabase Dashboard → Storage:

| Bucket Name | Purpose | Public |
|-------------|---------|--------|
| `profile-images` | Nurse profile photos | Yes |
| `employer-logos` | Company logos | Yes |
| `documents` | ID documents | No |

---

## Phase 3: Environment Variables

### New `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wqiuzgxpnvulozbkveil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXV6Z3hwbnZ1bG96Ymt2ZWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzUxODksImV4cCI6MjA4MTA1MTE4OX0.Z3uEwZT2NB_M7CDVrreCxkdLT77oG4lsj9dIxKKx6Mg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXV6Z3hwbnZ1bG96Ymt2ZWlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3NTE4OSwiZXhwIjoyMDgxMDUxMTg5fQ.jSET7FgSr5QIQJPaKVfY7XS-5kPFeVHs0Ur9suAPAao

# Google OAuth (keep existing)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Phase 4: Files to Create

### 4.1 Supabase Client
**File:** `src/lib/supabase.ts`

### 4.2 Auth Helpers
**File:** `src/lib/supabase-auth.ts`

### 4.3 API Functions
**File:** `src/lib/supabase-api.ts`

---

## Phase 5: API Migration Map

### Authentication (6 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/auth/login` | `supabase.auth.signInWithPassword()` | `signin/page.tsx` |
| `/email_otp` | Custom OTP function | `employerloginpage/page.tsx` |
| `/verify_otp` | Custom verify function | `employerloginpage/page.tsx` |
| `/reset_password_otp` | `supabase.auth.resetPasswordForEmail()` | `forgot_password_nurse/page.tsx` |
| `/verify_resetPassword_otp` | Custom verify function | `forgot_password_nurse/page.tsx` |
| `/update_password` | `supabase.auth.updateUser()` | `forgot_password_nurse/page.tsx` |

### Nurse Operations (8 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/nurse_onboarding` | `supabase.from('nurses').insert()` | `signup/page.tsx` |
| `/get_nurse_profile` | `supabase.from('nurses').select()` | `profile/page.tsx` |
| `/edit_nurse_profile` | `supabase.from('nurses').update()` | `profile/page.tsx` |
| `/image_edit` | `supabase.storage.upload()` | `profile/page.tsx` |
| `/toggle_visibility_status` | `supabase.from('nurses').update()` | `profile/page.tsx` |
| `/nurse_profiles_admin` | `supabase.from('nurses').select()` | `Admin/Nurses.tsx` |
| `/delete_nurse_Admin` | `supabase.from('nurses').delete()` | `Admin/Nurses.tsx` |
| `/get_nurse_for_employers` | `supabase.from('nurses').select()` | `Candidatelist/page.tsx` |

### Employer Operations (7 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/employerOnboarding` | `supabase.from('employers').insert()` | `registrationpage/page.tsx` |
| `/otp_employer_for_signUp` | Custom OTP function | `registrationpage/page.tsx` |
| `/verify_otp_for_employerSignUp` | Custom verify function | `registrationpage/page.tsx` |
| `/get_employer_profile` | `supabase.from('employers').select()` | `EmployerDashboard/page.tsx` |
| `/edit_employer_profile` | `supabase.from('employers').update()` | `employprofile/page.tsx` |
| `/employer_profiles` | `supabase.from('employers').select()` | `Admin/Employers.tsx` |
| `/delete_employer_id` | `supabase.from('employers').delete()` | `Admin/Employers.tsx` |

### Jobs (7 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `POST /jobs` | `supabase.from('jobs').insert()` | `jobposting/page.tsx` |
| `GET /jobs` | `supabase.from('jobs').select()` | `FeaturedJobs.tsx` |
| `/get_job_details` | `supabase.from('jobs').select()` | `EmployerDashboard/page.tsx` |
| `/edit_job_details` | `supabase.from('jobs').update()` | `jobposting/page.tsx` |
| `DELETE /jobs/:id` | `supabase.from('jobs').delete()` | `EmployerDashboard/page.tsx` |
| `/pause_active_job` | `supabase.from('jobs').update()` | `EmployerDashboard/page.tsx` |
| `/total_number_of_jobs` | `supabase.from('jobs').select('count')` | `Admin/Dashboard.tsx` |

### Applications (2 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/getAllNursesAppliedForJob` | `supabase.from('applications').select()` | `Applicants/[id]/page.tsx` |
| `/get_applied_jobs_for_nurse` | `supabase.from('applications').select()` | `AppliedJobs/page.tsx` |

### Education (5 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/get_education` | `supabase.from('education').select()` | `profile/page.tsx` |
| `/add_education` | `supabase.from('education').insert()` | `profile/page.tsx` |
| `/edit_education` | `supabase.from('education').update()` | `profile/page.tsx` |
| `/get_education_id` | `supabase.from('education').select()` | `profile/page.tsx` |
| `/delete_education` | `supabase.from('education').delete()` | `profile/page.tsx` |

### Work Experience (5 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/get_workExperience` | `supabase.from('work_experience').select()` | `profile/page.tsx` |
| `/add_work_experience` | `supabase.from('work_experience').insert()` | `profile/page.tsx` |
| `/edit_work_experience` | `supabase.from('work_experience').update()` | `profile/page.tsx` |
| `/get_workExperience_id` | `supabase.from('work_experience').select()` | `profile/page.tsx` |
| `/work_experience` (DELETE) | `supabase.from('work_experience').delete()` | `profile/page.tsx` |

### Company Profile (5 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/get_about_company` | `supabase.from('employers').select('about_company')` | `EmployerDashboard/page.tsx` |
| `POST /about_company` | `supabase.from('employers').update()` | `EmployerDashboard/page.tsx` |
| `PATCH /about_company` | `supabase.from('employers').update()` | `EmployerDashboard/page.tsx` |
| `DELETE /about_company` | `supabase.from('employers').update({about_company: null})` | `EmployerDashboard/page.tsx` |
| `/get_about_company_for_saved_jobs_page` | `supabase.from('employers').select()` | `jobPreview/[id]/page.tsx` |

### Connections (6 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/accepted_connections` | `supabase.from('connections').select('count')` | `Admin/Dashboard.tsx` |
| `/pending_connections` | `supabase.from('connections').select('count')` | `Admin/Dashboard.tsx` |
| `/rejected_connection` | `supabase.from('connections').select('count')` | `Admin/Dashboard.tsx` |
| `/total_number_of_connections` | `supabase.from('connections').select('count')` | `Admin/Connections.tsx` |
| `/connections` | `supabase.from('connections').select()` | `Admin/Connections.tsx` |
| `/getEmployerNotifications` | `supabase.from('connections').select()` | `status/page.tsx` |

### Wishlist (2 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/getJobsForSpecificNurse` | `supabase.from('saved_jobs').select()` | `SavedJobs/page.tsx` |
| `/getWishlistForSpecificEmployer` | `supabase.from('employer_wishlist').select()` | `Wishlist/page.tsx` |

### Admin Stats (4 endpoints)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/total_number_of_nurses` | `supabase.from('nurses').select('count')` | `Admin/Dashboard.tsx` |
| `/total_number_of_employers` | `supabase.from('employers').select('count')` | `Admin/Dashboard.tsx` |
| `/total_number_of_jobs` | `supabase.from('jobs').select('count')` | `Admin/Dashboard.tsx` |

### Contact (1 endpoint)

| Old Xano Endpoint | New Supabase Function | File |
|-------------------|----------------------|------|
| `/contact_us` | `supabase.from('contact_messages').insert()` | `contact/page.tsx` |

---

## Phase 6: Row Level Security (RLS)

### Enable RLS on All Tables
```sql
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
```

### Policy Examples (to be implemented)
```sql
-- Nurses can read their own profile
CREATE POLICY "Nurses can read own profile"
ON nurses FOR SELECT
USING (auth.uid()::text = id::text);

-- Jobs are readable by everyone
CREATE POLICY "Jobs are publicly readable"
ON jobs FOR SELECT
USING (status = 'Active');
```

---

## Phase 7: Testing Checklist

- [ ] Nurse registration (10-step wizard)
- [ ] Nurse login
- [ ] Nurse profile view
- [ ] Nurse profile edit
- [ ] Nurse profile image upload
- [ ] Nurse visibility toggle
- [ ] Employer registration with OTP
- [ ] Employer login with OTP
- [ ] Employer profile view/edit
- [ ] Job creation
- [ ] Job listing (public)
- [ ] Job edit
- [ ] Job delete
- [ ] Job pause/resume
- [ ] Job application (nurse)
- [ ] View applicants (employer)
- [ ] Applied jobs (nurse)
- [ ] Saved jobs (nurse)
- [ ] Employer wishlist
- [ ] Education CRUD
- [ ] Work experience CRUD
- [ ] Admin dashboard stats
- [ ] Admin nurse management
- [ ] Admin employer management
- [ ] Contact form
- [ ] Password reset

---

## Migration Progress

| Phase | Status | Completed |
|-------|--------|-----------|
| Phase 1: Database | Pending | [ ] |
| Phase 2: Storage | Pending | [ ] |
| Phase 3: Environment | Pending | [ ] |
| Phase 4: Supabase Client | Pending | [ ] |
| Phase 5: API Migration | Pending | [ ] |
| Phase 6: RLS Policies | Pending | [ ] |
| Phase 7: Testing | Pending | [ ] |

---

**Document Version:** 1.0
**Last Updated:** December 2025
