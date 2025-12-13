# V-Find Deployment Plan

## Overview
Deploy V-Find from local development to live URLs with:
- **Dev/Staging URL**: For testing (free) - `v-find-staging.vercel.app`
- **Production URL**: Client's domain (to be configured later)

## Your Setup
- **GitHub Repo**: `https://github.com/Zunkiree-Technologies/v-find.git`
- **Current Supabase**: `wqiuzgxpnvulozbkveil.supabase.co` (will be DEV)
- **Production Supabase**: Will create new project

## Stack (All Free Tier)

| Service | Purpose | Free Tier Limits |
|---------|---------|------------------|
| **Vercel** | Hosting Next.js app | 100GB bandwidth, unlimited deployments |
| **Supabase DEV** | Dev database (existing) | 500MB DB, 1GB storage |
| **Supabase PROD** | Prod database (new) | 500MB DB, 1GB storage |
| **GitHub** | Source control + CI/CD | Already have repo |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         ENVIRONMENTS                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   LOCAL DEV              STAGING                 PRODUCTION       │
│   localhost:3000         v-find.vercel.app       client-domain    │
│        │                      │                       │           │
│        └──────────┬───────────┘                       │           │
│                   │                                   │           │
│            ┌──────▼──────┐                    ┌──────▼──────┐    │
│            │  Supabase   │                    │  Supabase   │    │
│            │    DEV      │                    │    PROD     │    │
│            │  (existing) │                    │    (new)    │    │
│            └─────────────┘                    └─────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Strategy**: Local + Staging share DEV Supabase. Production uses separate PROD Supabase.

---

## Step-by-Step Deployment Guide

### Phase 1: Sync Local Code to GitHub

**Your Repo**: `https://github.com/Zunkiree-Technologies/v-find.git`

**Step 1.1: Check Remote Configuration**
```bash
git remote -v
```
If not configured:
```bash
git remote add origin https://github.com/Zunkiree-Technologies/v-find.git
```

**Step 1.2: Push Latest Changes**
```bash
git add .
git commit -m "Prepare for deployment"
git push -u origin main
```

**Step 1.3: Verify .gitignore**
Ensure these are NOT pushed (check .gitignore):
- `.env.local` - Contains secrets
- `.env` - Contains secrets
- `node_modules/` - Dependencies
- `.next/` - Build output

---

### Phase 2: Deploy to Vercel (Staging URL)

**Step 2.1: Create Vercel Account**
1. Go to https://vercel.com
2. Sign up with GitHub (recommended - links your repos automatically)
3. Choose "Hobby" plan (free)

**Step 2.2: Import Project**
1. Click "Add New Project"
2. Find `Zunkiree-Technologies/v-find` repository
3. Click "Import"
4. Vercel auto-detects Next.js 15

**Step 2.3: Configure Environment Variables (STAGING)**
In Vercel: Project Settings → Environment Variables

Add these for **Preview + Development** environments:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wqiuzgxpnvulozbkveil.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (copy from your .env.local) |
| `SUPABASE_SERVICE_ROLE_KEY` | (copy from your .env.local) |
| `NEXT_PUBLIC_APP_URL` | `https://v-find.vercel.app` |
| `GOOGLE_CLIENT_ID` | (your Google OAuth ID) |
| `GOOGLE_CLIENT_SECRET` | (your Google OAuth secret) |

**Step 2.4: Deploy**
1. Click "Deploy"
2. Build takes ~2-3 minutes
3. Get your staging URL: `https://v-find.vercel.app` (or similar)

**Result**: Live staging URL connected to your DEV Supabase!

---

### Phase 3: Update Supabase & OAuth for Staging

**Step 3.1: Update Supabase URL Configuration**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add Site URL: `https://v-find.vercel.app` (your staging URL)
3. Add Redirect URLs:
   - `https://v-find.vercel.app/oauth/callback`

**Step 3.2: Update Google OAuth (if using)**
1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials → Your OAuth Client
3. Add Authorized redirect URI:
   - `https://v-find.vercel.app/oauth/callback`

---

### Phase 4: Create Production Supabase (When Ready for Production)

**Step 4.1: Create New Supabase Project**
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name it: `vfind-production`
4. Choose region closest to Australia (Sydney)
5. Set a strong database password

**Step 4.2: Replicate Database Schema**
Option A - Export/Import:
```bash
# From Supabase Dashboard → SQL Editor
# Export schema from DEV project, run in PROD project
```

Option B - Migration Script:
I can help create a migration script to replicate tables.

**Step 4.3: Copy Storage Buckets**
In new Supabase project, create buckets:
- `profile-images` (public)
- `resumes` (authenticated)
- `company-logos` (public)

**Step 4.4: Note New Credentials**
Save these from the new PROD Supabase:
- Project URL: `https://[new-project-id].supabase.co`
- Anon Key: (from Settings → API)
- Service Role Key: (from Settings → API)

---

### Phase 5: Configure Production Domain (When Client Provides)

**Step 5.1: Add Domain in Vercel**
1. Project → Settings → Domains
2. Add client's domain (e.g., `vfind.com.au`)
3. Vercel shows required DNS records

**Step 5.2: DNS Configuration (at domain registrar)**
| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

**Step 5.3: SSL Certificate**
- Vercel auto-provisions SSL (free)
- Active within 5-30 minutes of DNS propagation

**Step 5.4: Add Production Environment Variables**
In Vercel, add for **Production** environment only:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[prod-project].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (PROD anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | (PROD service role key) |
| `NEXT_PUBLIC_APP_URL` | `https://client-domain.com` |

**Step 5.5: Update PROD Supabase URL Config**
1. PROD Supabase Dashboard → Authentication → URL Configuration
2. Add Site URL: `https://client-domain.com`
3. Add Redirect URLs for OAuth

**Step 5.6: Update Google OAuth for Production**
Add production redirect URI to Google Console.

---

## Deployment Workflow (After Setup)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Local Dev   │────▶│    GitHub    │────▶│    Vercel    │
│  localhost   │push │    v-find    │auto │  Deployment  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                           ┌─────────────────────┴─────────────────────┐
                           │                                           │
                           ▼                                           ▼
                    ┌──────────────┐                           ┌──────────────┐
                    │   Staging    │                           │  Production  │
                    │ (vercel.app) │                           │(client domain│
                    │   DEV DB     │                           │   PROD DB    │
                    └──────────────┘                           └──────────────┘
```

**Daily Workflow:**
1. Develop locally → `git push` → Auto-deploys to staging
2. Test on staging URL with DEV database
3. When production ready → Add domain → Uses PROD database

---

## Environment Summary

| Environment | URL | Database | Auto-Deploy |
|-------------|-----|----------|-------------|
| Local | `localhost:3000` | DEV Supabase | No |
| Staging | `v-find.vercel.app` | DEV Supabase | On push |
| Production | (client domain) | PROD Supabase | On push |

---

## Cost Summary (All Free)

| Service | Monthly Cost | Limits |
|---------|-------------|--------|
| Vercel Hobby | $0 | 100GB bandwidth, 6000 build mins |
| Supabase DEV | $0 | 500MB DB, 1GB storage |
| Supabase PROD | $0 | 500MB DB, 1GB storage |
| GitHub | $0 | Unlimited private repos |
| **Total** | **$0** | Perfect for MVP |

**When to upgrade (future):**
- Vercel Pro ($20/mo): More bandwidth, team features
- Supabase Pro ($25/mo): Backups, more storage, support

---

## Checklist

### Stage 1: Staging Deployment (TODAY)
- [ ] Push latest code to GitHub
- [ ] Create Vercel account
- [ ] Import project to Vercel
- [ ] Add environment variables (DEV Supabase)
- [ ] Deploy and get staging URL
- [ ] Update Supabase URL configuration
- [ ] Test staging deployment

### Stage 2: Production (WHEN CLIENT PROVIDES DOMAIN)
- [ ] Create PROD Supabase project
- [ ] Replicate database schema
- [ ] Create storage buckets
- [ ] Add production domain in Vercel
- [ ] Configure DNS records
- [ ] Add PROD environment variables
- [ ] Update OAuth configurations
- [ ] Test production deployment

---

## Quick Commands

```bash
# Local development
npm run dev

# Test build locally before pushing
npm run build && npm run start

# Deploy (automatic on push)
git add .
git commit -m "Your changes"
git push origin main
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Vercel logs, run `npm run build` locally |
| Images not loading | Check next.config.ts image domains, bucket permissions |
| Auth not working | Verify NEXT_PUBLIC_APP_URL matches deployed URL |
| OAuth fails | Add redirect URI to Google Console & Supabase |

---

## Next Steps

When ready to execute:

1. **Push code to GitHub** - Run git commands
2. **Set up Vercel** - Create account, import project
3. **Configure environment variables** - Copy values from .env.local
4. **Test deployment** - Verify everything works
5. **Create PROD Supabase** (later) - Schema migration script

**Estimated Time:**
- Staging deployment: ~20-30 minutes
- Production setup: ~30-45 minutes (when domain ready)
