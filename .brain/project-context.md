# V-Find Project Context

**Project Name:** V-Find
**Instance Name:** v-find-stark
**Status:** Active Development
**Created:** 2025-12-02
**Brain Setup:** 2025-12-12
**Major Update:** 2025-12-12 (Supabase Migration)

---

## Project Overview

V-Find is a **healthcare job matching platform** connecting nurses/healthcare workers with employers in Australia. Features include job search, applications, profile management, and connection requests.

## Tech Stack

### Frontend
- **Framework:** Next.js 15.4.4
- **UI Library:** React 19.1.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Build Tool:** Turbopack

### Backend (Updated 2025-12-12)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom token system (`role_userId_timestamp`)
- **Storage:** Supabase Storage (profile-images, resumes, company-logos)
- **Previous:** Xano (migrated away)

### UI Components
- **Component Library:** Radix UI (checkbox, label, radio-group, select, separator, slot, toast, toggle)
- **Icons:** Lucide React, Heroicons, React Icons
- **Rich Text Editor:** TipTap (with Link and Placeholder extensions)
- **Alternative Editor:** Slate (slate-react, slate-history)
- **Carousel:** Swiper
- **Form Handling:** React Hook Form + Zod validation

### Utilities
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Themes:** next-themes
- **Cookies:** js-cookie
- **Animations:** tw-animate-css, canvas-confetti

## Project Structure

```
vfind-dev/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── contexts/      # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   │   ├── supabase.ts       # Supabase client + types
│   │   ├── supabase-auth.ts  # Auth functions
│   │   └── supabase-api.ts   # API helper functions
│   ├── utils/         # Helper functions
│   └── middleware.ts  # Next.js middleware
├── components/        # Root-level components (shadcn/ui)
├── public/            # Static assets
├── docs/              # Project documentation
├── .brain/            # Brain system files
├── SS/                # Screenshots/assets
└── postcodes.json     # Australian postcode data
```

## Database Schema (Supabase)

### Tables
1. **nurses** - Nurse profiles and credentials
2. **employers** - Employer/company profiles
3. **jobs** - Job postings
4. **applications** - Job applications
5. **education** - Nurse education records
6. **work_experience** - Nurse work history
7. **connections** - Employer-nurse connection requests
8. **otp_tokens** - OTP for email verification
9. **contact_messages** - Contact form submissions
10. **saved_jobs** - Nurse saved/bookmarked jobs
11. **employer_wishlist** - Employer saved candidates

### Storage Buckets
- **profile-images** - Nurse profile photos
- **resumes** - Nurse resume files
- **company-logos** - Employer company logos

## User Types

1. **Nurses/Healthcare Workers**
   - 10-step registration wizard
   - Job search and applications
   - Profile management
   - Connection requests from employers

2. **Employers**
   - Company registration with OTP
   - Job posting
   - Candidate search and viewing
   - Send connection requests

3. **Admins**
   - Dashboard with stats
   - Manage nurses/employers
   - View connections

## Team
- **Lead:** Sadin

## Repository
- Local development

## Deployment
- **Dev:** localhost:3000
- **Prod:** TBD (Vercel recommended)

---

## Key Features

- **Job Search** - Filter by type, location, pay, experience
- **10-Step Nurse Registration** - Comprehensive onboarding
- **Employer Dashboard** - Job management, candidates, analytics
- **Connection System** - Employer requests, nurse accepts/rejects
- **Admin Panel** - Platform management

---

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://wqiuzgxpnvulozbkveil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Notes

- Uses modern React 19 with Next.js 15
- Turbopack enabled for faster development
- Migrated from Xano to Supabase (2025-12-12)
- Australian healthcare market focus
- Token format: `role_userId_timestamp`
