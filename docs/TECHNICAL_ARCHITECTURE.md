# V-Find Technical Architecture

## Overview

V-Find is built on a modern, scalable architecture using Next.js 15 with React 19, TypeScript, and Tailwind CSS v4. The backend is powered by Xano (Backend-as-a-Service), providing a robust API layer without managing infrastructure.

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.4.4 | React framework with App Router |
| React | 19.1.0 | UI library with concurrent features |
| TypeScript | 5.x | Type safety and developer experience |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Turbopack | Latest | Fast development builds |

### UI Components

| Library | Purpose |
|---------|---------|
| Radix UI | Accessible, unstyled primitives |
| Shadcn/ui | Pre-built component system |
| Lucide React | Icon library |
| Heroicons | Additional icons |
| React Icons | Extended icon set |

### Form & Validation

| Library | Purpose |
|---------|---------|
| React Hook Form | Form state management |
| Zod | Schema validation |
| React Select | Enhanced select inputs |

### Rich Text Editing

| Library | Purpose |
|---------|---------|
| TipTap | Primary rich text editor |
| Slate | Alternative editor (available) |

### Data & HTTP

| Library | Purpose |
|---------|---------|
| Axios | HTTP client for API calls |
| date-fns | Date manipulation |
| jwt-decode | JWT token parsing |

### Authentication

| Library | Purpose |
|---------|---------|
| NextAuth v4 | Authentication framework |
| js-cookie | Cookie management |
| Custom middleware | Route protection |

### UI Enhancements

| Library | Purpose |
|---------|---------|
| Swiper | Carousel/slider |
| canvas-confetti | Celebration animations |
| next-themes | Dark mode support |
| tw-animate-css | Animations |

### Backend

| Service | Purpose |
|---------|---------|
| Xano | BaaS - Database, APIs, Authentication |

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Cookies   │  │ localStorage│  │    sessionStorage       │ │
│  │ (authToken) │  │  (legacy)   │  │    (session sync)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APPLICATION                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      MIDDLEWARE                           │  │
│  │  - Route protection                                       │  │
│  │  - Role validation                                        │  │
│  │  - Security headers                                       │  │
│  │  - Redirect handling                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    APP ROUTER (src/app)                   │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │  │
│  │  │   Public    │ │    Nurse    │ │     Employer        │ │  │
│  │  │   Pages     │ │   Portal    │ │      Portal         │ │  │
│  │  ├─────────────┤ ├─────────────┤ ├─────────────────────┤ │  │
│  │  │ /           │ │ /nurseProfile│ │ /EmployerDashboard │ │  │
│  │  │ /signin     │ │ /joblist    │ │ /jobposting        │ │  │
│  │  │ /signup     │ │ /profile    │ │ /Candidatelist     │ │  │
│  │  │ /blogs      │ │ /AppliedJobs│ │ /Applicants        │ │  │
│  │  │ /contact    │ │ /SavedJobs  │ │ /Wishlist          │ │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘ │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │                    Admin Portal                      │ │  │
│  │  │  /Admin  /Admin/Employers  /Admin/Nurses            │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    CONTEXTS & HOOKS                       │  │
│  │  - AuthContext (global auth state)                        │  │
│  │  - useAuth() hook                                         │  │
│  │  - useToast() hook                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      UTILITIES                            │  │
│  │  - cookies.ts (cookie management)                         │  │
│  │  - authSync.ts (multi-tab sync)                          │  │
│  │  - utils.ts (helpers)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                         XANO BACKEND                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API ENDPOINTS                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Auth:     /auth/login, /auth/me                        │   │
│  │  Nurses:   /nurse_onboarding, /nurse_profile            │   │
│  │  Employers:/employerOnboarding, /get_employer_profile   │   │
│  │  Jobs:     /jobs, /get_job_details, /pause_active_job   │   │
│  │  OTP:      /otp_employer_for_signUp, /verify_otp        │   │
│  │  Company:  /about_company (GET, POST, PATCH, DELETE)    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      DATABASE                            │   │
│  │  - Nurses table                                          │   │
│  │  - Employers table                                       │   │
│  │  - Jobs table                                            │   │
│  │  - Applications table                                    │   │
│  │  - Connections table                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    FILE STORAGE                          │   │
│  │  - Profile images                                        │   │
│  │  - Documents                                             │   │
│  │  - Company logos                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
vfind-dev/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Global styles
│   │   ├── ThemeWrapper.tsx          # Theme provider
│   │   │
│   │   ├── signin/                   # Nurse login
│   │   ├── signup/                   # Nurse registration (10 steps)
│   │   │   ├── page.tsx              # Main wizard
│   │   │   ├── components/           # Step components
│   │   │   │   ├── JobTypesStep.tsx
│   │   │   │   ├── ShiftPreferanceStep.tsx
│   │   │   │   ├── StartTimeStep.tsx
│   │   │   │   ├── JobSearchStatusStep.tsx
│   │   │   │   ├── QualificationStep.tsx
│   │   │   │   ├── WorkingInHealthcareStep.tsx
│   │   │   │   ├── LocationPreferenceStep.tsx
│   │   │   │   ├── CertificationsStep.tsx
│   │   │   │   ├── ResidencyVisaStep.tsx
│   │   │   │   └── ContactPasswordStep.tsx
│   │   │   ├── types/                # Form types
│   │   │   └── json/                 # Location data
│   │   │
│   │   ├── employerloginpage/        # Employer login
│   │   ├── foremployer/              # Employer landing
│   │   │
│   │   ├── nurseProfile/             # Nurse dashboard
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── profile/              # Profile management
│   │   │   ├── AppliedJobs/          # Applied jobs list
│   │   │   ├── SavedJobs/            # Saved jobs list
│   │   │   ├── connectedstatus/      # Connection status
│   │   │   ├── jobapplicationpage/   # Job application
│   │   │   ├── components/           # Nurse components
│   │   │   └── utils/                # Nurse utilities
│   │   │
│   │   ├── EmployerDashboard/        # Employer dashboard
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── employprofile/        # Employer profile
│   │   │   ├── jobposting/           # Create/edit jobs
│   │   │   ├── jobPreview/           # Preview job
│   │   │   ├── Candidatelist/        # Browse candidates
│   │   │   ├── Applicants/           # View applicants
│   │   │   ├── Wishlist/             # Saved candidates
│   │   │   ├── status/               # Analytics
│   │   │   └── components/           # Employer components
│   │   │
│   │   ├── Admin/                    # Admin dashboard
│   │   │   ├── page.tsx              # Admin home
│   │   │   ├── components/
│   │   │   │   ├── layout/           # Header, Footer, Sidebar
│   │   │   │   ├── navigation/       # Nav components
│   │   │   │   ├── views/            # Dashboard, Employers, Nurses
│   │   │   │   ├── Employers/[id]/   # Employer detail
│   │   │   │   └── Nurses/[id]/      # Nurse detail
│   │   │   └── types/                # Admin types
│   │   │
│   │   ├── joblist/                  # Public job listings
│   │   ├── blogs/                    # Blog pages
│   │   ├── contact/                  # Contact page
│   │   ├── about/                    # About page
│   │   ├── terms/                    # Terms of service
│   │   ├── oauth/callback/           # OAuth handler
│   │   ├── forgot_password_nurse/    # Nurse password reset
│   │   ├── forgot-password-employer/ # Employer password reset
│   │   ├── congratulation/           # Success page
│   │   └── stilldeveloping/          # Coming soon
│   │
│   ├── components/                   # Shared components
│   │   └── ui/                       # Shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── select.tsx
│   │       ├── checkbox.tsx
│   │       ├── radio-group.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── ...
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx           # Global auth state
│   │
│   ├── hooks/
│   │   └── use-toast.ts              # Toast notifications
│   │
│   ├── lib/
│   │   ├── auth.ts                   # Auth helpers (legacy)
│   │   └── utils.ts                  # Utility functions
│   │
│   ├── utils/
│   │   ├── cookies.ts                # Cookie management
│   │   └── authSync.ts               # Multi-tab session sync
│   │
│   └── middleware.ts                 # Route protection
│
├── components/                       # Root landing components
│   ├── navbar.tsx
│   ├── hero-section.tsx
│   ├── benefits-section.tsx
│   ├── FeaturedCompanies.tsx
│   ├── FeaturedJobs.tsx
│   ├── how-it-works-section.tsx
│   ├── testimonials-sections.tsx
│   ├── footer-section.tsx
│   └── ...
│
├── public/                           # Static assets
│   ├── assets/
│   └── icons/
│
├── docs/                             # Documentation
│
├── .brain/                           # AI assistant context
│
├── Configuration Files
│   ├── next.config.ts                # Next.js config
│   ├── tailwind.config.ts            # Tailwind config
│   ├── tsconfig.json                 # TypeScript config
│   ├── postcss.config.mjs            # PostCSS config
│   ├── components.json               # Shadcn/ui config
│   ├── eslint.config.mjs             # ESLint config
│   ├── package.json                  # Dependencies
│   └── .env.example                  # Environment template
│
└── postcodes.json                    # Australian postcode data
```

---

## Authentication Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User enters credentials                                      │
│     │                                                            │
│     ▼                                                            │
│  2. POST to Xano /auth/login                                     │
│     │                                                            │
│     ▼                                                            │
│  3. Xano validates & returns authToken                           │
│     │                                                            │
│     ▼                                                            │
│  4. setAuthCookies(token, role, email)                          │
│     │                                                            │
│     ├── Sets 'authToken' cookie                                  │
│     ├── Sets 'userRole' cookie                                   │
│     ├── Sets 'userEmail' cookie                                  │
│     └── Also writes to localStorage (backward compatibility)     │
│     │                                                            │
│     ▼                                                            │
│  5. registerSession() - for multi-tab sync                       │
│     │                                                            │
│     ▼                                                            │
│  6. AuthContext.login() - updates React state                    │
│     │                                                            │
│     ▼                                                            │
│  7. Redirect to dashboard                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   ROUTE PROTECTION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User navigates to protected route                            │
│     │                                                            │
│     ▼                                                            │
│  2. Middleware intercepts request                                │
│     │                                                            │
│     ▼                                                            │
│  3. Read cookies: authToken, userRole                            │
│     │                                                            │
│     ├── No token? → Redirect to login                            │
│     │                                                            │
│     ├── Wrong role? → Redirect to correct dashboard              │
│     │                                                            │
│     └── Valid? → Continue to page                                │
│     │                                                            │
│     ▼                                                            │
│  4. Add security headers to response                             │
│     │                                                            │
│     ▼                                                            │
│  5. Return response                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Protected Routes

| Route Pattern | Required Role | Redirect On Fail |
|---------------|---------------|------------------|
| `/nurseProfile/*` | Nurse | `/signin` |
| `/joblist/*` | Nurse | `/signin` |
| `/EmployerDashboard/*` | Employer | `/employerloginpage` |
| `/Applicants/*` | Employer | `/employerloginpage` |
| `/Admin/*` | Admin | Not yet protected |

### Cookie Configuration

```typescript
// Cookie settings
{
  path: "/",
  expires: 7,                    // 7 days
  secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
  sameSite: "strict"             // CSRF protection
}
```

### Multi-Tab Session Sync

```
┌─────────────────────────────────────────────────────────────────┐
│                  MULTI-TAB SYNC FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tab A: User logs in                                             │
│  │                                                               │
│  ├── registerSession() stores in sessionStorage                  │
│  │   - sessionId (unique per tab)                                │
│  │   - role                                                      │
│  │   - email                                                     │
│  │                                                               │
│  └── Writes to localStorage: 'vfind_session_update'              │
│                                                                  │
│  Tab B: Listening for storage events                             │
│  │                                                               │
│  ├── Detects localStorage change                                 │
│  │                                                               │
│  ├── Compares session info                                       │
│  │   - Different user? → Force logout                            │
│  │   - Same user? → Allow                                        │
│  │                                                               │
│  └── If forced logout → Alert + Redirect to home                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Implementation

### Security Headers (Middleware)

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-XSS-Protection | 1; mode=block | Enable XSS filter |
| Referrer-Policy | strict-origin-when-cross-origin | Control referrer info |

### Security Best Practices Implemented

1. **Cookie-based Authentication**
   - Tokens stored in cookies (not localStorage for main auth)
   - SameSite=strict for CSRF protection
   - Secure flag in production

2. **Role-based Access Control**
   - Middleware validates role before page access
   - Cross-role access prevented

3. **Input Validation**
   - Zod schemas for form validation
   - Server-side validation on Xano

4. **Session Management**
   - 7-day token expiry
   - Multi-tab logout detection
   - Forced logout on different account login

---

## State Management

### Global State (AuthContext)

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    email: string | null;
    role: "Nurse" | "Employer" | null;
    token: string | null;
  };
  login: (token: string, role: "Nurse" | "Employer", email: string) => void;
  logout: () => void;
  refreshAuth: () => void;
}
```

### Local State Patterns

- **Component state**: useState for UI state
- **Form state**: React Hook Form
- **Server state**: Direct fetch with useEffect
- **URL state**: Next.js useSearchParams

---

## Data Flow Patterns

### API Request Pattern

```typescript
// Standard API call pattern
const fetchData = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch("https://xano-url/endpoint", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    setState(data);
  } catch (err) {
    console.error("Error:", err);
  }
};
```

### Form Submission Pattern

```typescript
// Multi-step form pattern (signup)
const handleSubmit = async () => {
  // Validate all steps
  for (let step = 1; step <= totalSteps; step++) {
    if (!isStepComplete(step)) {
      alert(`Complete step ${step}`);
      return;
    }
  }

  // Build FormData
  const form = new FormData();
  for (const key in formData) {
    // Handle arrays, files, strings appropriately
    form.append(key, value);
  }

  // Submit
  const response = await fetch(endpoint, {
    method: "POST",
    body: form
  });
};
```

---

## Build & Development

### Development Server

```bash
npm run dev
# Uses Turbopack for fast rebuilds
# Available at http://localhost:3000
```

### Production Build

```bash
npm run build
# Creates optimized production build in .next/

npm run start
# Starts production server
```

### Type Checking

```bash
# TypeScript is configured with strict mode
# Types checked during build
```

### Linting

```bash
npm run lint
# ESLint with Next.js recommended rules
```

---

## Performance Considerations

### Current Optimizations

1. **Turbopack**: Fast development builds
2. **Next.js Image**: Automatic image optimization
3. **Code Splitting**: Automatic per-route
4. **React 19**: Concurrent features enabled

### Recommended Future Optimizations

1. **API Response Caching**: Implement SWR or React Query
2. **Static Generation**: Pre-render public pages
3. **Bundle Analysis**: Identify large dependencies
4. **Lazy Loading**: Split heavy components

---

## External Dependencies

### Xano CDN Domains (for images)

```
x8ki-letl-twmt.n7.xano.io
x76o-gnx4-xrav.a2.xano.io
```

### Other Image Sources

```
images.unsplash.com
media2.dev.to
dev-to-uploads.s3.amazonaws.com
res.cloudinary.com
```

---

## Error Handling

### Client-Side Error Handling

```typescript
// API error handling pattern
try {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return await response.json();
} catch (err) {
  // Log error
  console.error("API Error:", err);

  // Show user-friendly message
  alert("Something went wrong. Please try again.");
}
```

### Error Messages by Status Code

| Code | Message |
|------|---------|
| 400 | Bad Request: Check form data |
| 401 | Unauthorized: Check credentials |
| 403 | Forbidden: No permission |
| 409 | Conflict: Duplicate entry |
| 422 | Validation Error |
| 500 | Server Error |
| 503 | Service Unavailable |

---

## Testing Strategy (Recommended)

### Unit Testing
- Component testing with React Testing Library
- Utility function testing with Jest

### Integration Testing
- API integration tests
- Authentication flow tests

### E2E Testing
- Playwright or Cypress
- Critical user journeys

---

## Monitoring & Logging (Recommended)

### Production Monitoring
- Error tracking (Sentry recommended)
- Performance monitoring
- API response time tracking

### Logging
- Console logging in development
- Structured logging in production

---

**Document Version:** 1.0
**Last Updated:** December 2025
