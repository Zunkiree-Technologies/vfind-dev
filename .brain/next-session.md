# V-Find Next Session Priorities

**Last Updated:** 2025-12-12

---

## Immediate Priorities

1. **Complete Testing of Migrated Features**
   - [x] Nurse registration (WORKING)
   - [ ] Nurse login with registered account
   - [ ] Nurse profile page loads correctly
   - [ ] Job listing/search works
   - [ ] Job application flow

2. **Test Employer Flows**
   - [ ] Employer registration (via /foremployer -> /registrationpage)
   - [ ] Employer login
   - [ ] Employer dashboard loads
   - [ ] Job posting works
   - [ ] Candidate viewing

3. **Test Connection System**
   - [ ] Employer sends connection request
   - [ ] Nurse receives notification
   - [ ] Nurse accepts/rejects
   - [ ] Status updates correctly

4. **Test Admin Dashboard**
   - [ ] Stats load correctly
   - [ ] Nurses list
   - [ ] Employers list
   - [ ] Connections list

---

## Known Issues to Watch

1. **OTP Email Sending** - Currently only logs to console
   - Need to integrate email service (SendGrid, Resend, etc.)
   - Affects: forgot password, employer registration

2. **Password Hashing** - Using SHA-256
   - Should migrate to bcrypt for production

3. **Google OAuth** - Needs Supabase Auth setup
   - Configure in Supabase dashboard if needed

---

## Pending Items

- [ ] Add email service for OTP
- [ ] Production deployment setup
- [ ] Error handling improvements
- [ ] Loading states verification

---

## Quick Test URLs

- Nurse Signup: http://localhost:3000/signup
- Nurse Login: http://localhost:3000/signin
- Employer Login: http://localhost:3000/employerloginpage
- Employer Signup: http://localhost:3000/foremployer
- Job List: http://localhost:3000/joblist
- Admin: http://localhost:3000/Admin

---

## Supabase Quick Reference

**Project:** wqiuzgxpnvulozbkveil.supabase.co

**Tables:** nurses, employers, jobs, applications, education, work_experience, connections, otp_tokens, contact_messages, saved_jobs, employer_wishlist

**Storage Buckets:** profile-images, resumes, company-logos

**Token Format:** `role_userId_timestamp`
