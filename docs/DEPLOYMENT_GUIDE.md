# V-Find Deployment Guide

This guide covers the complete deployment process for V-Find, including local development setup, environment configuration, and production deployment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Build Process](#build-process)
5. [Deployment Options](#deployment-options)
6. [Production Checklist](#production-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Recommended |
|----------|-----------------|-------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| Git | 2.x | Latest |

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or higher

# Check Git version
git --version
```

### System Requirements

| Environment | RAM | CPU | Storage |
|-------------|-----|-----|---------|
| Development | 4GB | 2 cores | 1GB |
| Production | 1GB | 1 core | 500MB |

---

## Local Development Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd vfind-dev
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# If you encounter issues, try:
npm install --legacy-peer-deps
```

### Step 3: Environment Setup

```bash
# Copy the environment template
cp .env.example .env.local

# Edit the file with your values
# On Windows: notepad .env.local
# On Mac/Linux: nano .env.local
```

### Step 4: Start Development Server

```bash
# Start with Turbopack (fast refresh)
npm run dev

# Application available at:
# http://localhost:3000
```

### Step 5: Verify Setup

1. Open `http://localhost:3000` in your browser
2. Verify the homepage loads correctly
3. Check browser console for errors
4. Test the signup flow

---

## Environment Variables

### Required Variables

```bash
# ===========================================
# XANO BACKEND ENDPOINTS
# ===========================================

# Nurse onboarding/registration endpoint
NEXT_PUBLIC_XANO_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/nurse_onboarding

# Authentication login endpoint
NEXT_PUBLIC_LOGIN_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/auth/login

# Get current user endpoint
NEXT_PUBLIC_AUTH_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/auth/me

# Nurse profile management endpoint
NEXT_PUBLIC_NURSE_PROFILE_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:YhrHeNAH/nurse_profile

# Employer registration endpoint
NEXT_PUBLIC_XANO_REGISTRATION_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:5OnHwV4U/employerOnboarding

# Job posting CRUD endpoint
NEXT_PUBLIC_XANO_JOB_POST_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/jobs

# OTP sending for employer signup
NEXT_PUBLIC_SEND_OTP_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/otp_employer_for_signUp

# OTP verification for employer signup
NEXT_PUBLIC_VERIFY_OTP_ENDPOINT=https://x76o-gnx4-xrav.a2.xano.io/api:0zPratjM/verify_otp_for_employerSignUp

# ===========================================
# GOOGLE OAUTH (Optional but recommended)
# ===========================================

# Get these from Google Cloud Console
# https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# ===========================================
# APPLICATION URL
# ===========================================

# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (update when deploying)
# NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Variable Naming Convention

| Prefix | Visibility | Use Case |
|--------|------------|----------|
| `NEXT_PUBLIC_` | Client + Server | APIs called from browser |
| No prefix | Server only | Secrets, OAuth credentials |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Configure authorized origins:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
6. Configure authorized redirect URIs:
   - `http://localhost:3000/oauth/callback`
   - `https://your-domain.com/oauth/callback`
7. Copy Client ID and Client Secret to `.env.local`

---

## Build Process

### Development Build

```bash
# Start development server with hot reload
npm run dev

# Features:
# - Turbopack for fast builds
# - Hot Module Replacement (HMR)
# - Error overlay
# - Source maps
```

### Production Build

```bash
# Create optimized production build
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

### Build Output

```
.next/
├── cache/           # Build cache
├── server/          # Server-side code
├── static/          # Static assets
└── BUILD_ID         # Unique build identifier
```

### Analyze Bundle (Optional)

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

# Run analysis
ANALYZE=true npm run build
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the creator of Next.js and offers the best deployment experience.

#### Automatic Deployment

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables in Vercel dashboard
5. Deploy

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Vercel Configuration

```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["syd1"],  // Sydney for Australian users
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://your-domain.vercel.app"
  }
}
```

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option 3: Docker

#### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://your-domain.com
    env_file:
      - .env.production
```

#### Build & Run

```bash
# Build image
docker build -t vfind .

# Run container
docker run -p 3000:3000 vfind

# Or with docker-compose
docker-compose up -d
```

---

### Option 4: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd vfind-dev

# Install dependencies
npm ci --production

# Build
npm run build

# Start with PM2
pm2 start npm --name "vfind" -- start

# Auto-start on reboot
pm2 startup
pm2 save
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/vfind
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

---

## Production Checklist

### Before Deployment

- [ ] **Environment Variables**
  - [ ] All required variables set
  - [ ] No sensitive data in code
  - [ ] Production URLs configured

- [ ] **Security**
  - [ ] HTTPS enabled
  - [ ] Cookies set with `secure: true`
  - [ ] CORS properly configured (if applicable)
  - [ ] Security headers verified

- [ ] **Build**
  - [ ] Production build succeeds
  - [ ] No TypeScript errors
  - [ ] No ESLint errors

- [ ] **Testing**
  - [ ] Authentication flows work
  - [ ] Nurse registration completes
  - [ ] Employer registration completes
  - [ ] Job posting works
  - [ ] All protected routes redirect correctly

### After Deployment

- [ ] **Verification**
  - [ ] Homepage loads
  - [ ] Login works
  - [ ] Registration works
  - [ ] API calls succeed
  - [ ] Images load correctly

- [ ] **Monitoring**
  - [ ] Error tracking configured
  - [ ] Performance monitoring active
  - [ ] SSL certificate valid

---

## Security Considerations

### Cookie Security

```typescript
// Production cookie settings
{
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  path: '/',
  expires: 7           // 7 days
}
```

### Headers (Applied by Middleware)

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-XSS-Protection | 1; mode=block | XSS protection |
| Referrer-Policy | strict-origin-when-cross-origin | Referrer control |

### Additional Recommendations

1. **Content Security Policy (CSP)**
   ```typescript
   // Add to middleware or next.config.ts
   "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
   ```

2. **Rate Limiting**
   - Implement at CDN/edge level
   - Or use Next.js middleware

3. **HTTPS Everywhere**
   - Force HTTPS redirect
   - Use HSTS header

---

## Monitoring & Maintenance

### Recommended Monitoring Tools

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| Vercel Analytics | Performance | Yes |
| Sentry | Error tracking | Yes (5k events/mo) |
| UptimeRobot | Uptime monitoring | Yes (50 monitors) |
| Google Analytics | User analytics | Yes |

### Sentry Integration

```bash
# Install Sentry
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  tracesSampleRate: 1.0,
});
```

### Log Management

```typescript
// Production logging pattern
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};  // Disable console.log
  // Use structured logging service instead
}
```

### Backup Strategy

1. **Database**: Xano handles database backups
2. **Code**: Git repository is the source of truth
3. **Environment**: Keep `.env.production` secure and backed up

---

## Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### API Connection Issues

1. Verify environment variables are set
2. Check Xano API status
3. Verify CORS settings in Xano
4. Check browser network tab for errors

#### Authentication Not Working

1. Clear browser cookies
2. Verify cookie domain matches
3. Check if HTTPS is required (production)
4. Verify token expiry settings

#### Images Not Loading

1. Check `next.config.ts` remote patterns
2. Verify image URLs are correct
3. Check CDN accessibility

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* npm run dev

# Check Next.js build info
npm run build 2>&1 | tee build.log
```

### Support Resources

- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Xano Documentation: [docs.xano.com](https://docs.xano.com)
- Vercel Support: [vercel.com/support](https://vercel.com/support)

---

## Maintenance Tasks

### Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest major versions (careful!)
npx npm-check-updates -u
npm install
```

### Database Maintenance

- Monitor Xano usage and quotas
- Review and clean up old data
- Optimize queries if needed

### Performance Optimization

1. Enable caching headers
2. Optimize images
3. Implement lazy loading
4. Monitor Core Web Vitals

---

## Quick Reference

### Commands Cheatsheet

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `vercel` | Deploy to Vercel |
| `vercel --prod` | Deploy to production |

### Important URLs

| Environment | URL |
|-------------|-----|
| Local Dev | http://localhost:3000 |
| Production | https://your-domain.com |
| Xano Dashboard | https://app.xano.com |
| Vercel Dashboard | https://vercel.com/dashboard |

---

**Document Version:** 1.0
**Last Updated:** December 2025
