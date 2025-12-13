import { supabase } from './supabase';
import type { Nurse, Employer, OTPToken } from './supabase';

// Simple hash function for passwords (in production, use bcrypt on server-side)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============================================
// NURSE AUTHENTICATION
// =============================================

export async function registerNurse(nurseData: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  postcode?: string;
  currentResidentialLocation?: string;
  jobTypes?: string | string[];
  openToOtherTypes?: string;
  shiftPreferences?: string[];
  startTime?: string;
  startDate?: string;
  jobSearchStatus?: string;
  qualification?: string;
  otherQualification?: string;
  workingInHealthcare?: string;
  experience?: string;
  organisation?: string;
  locationPreference?: string;
  preferredLocations?: string[];
  certifications?: string[];
  residencyStatus?: string;
  visaType?: string;
  visaDuration?: string;
  workHoursRestricted?: string;
  maxWorkHours?: string;
  termsAccepted?: boolean;
  visibilityStatus?: string;
}): Promise<{ success: boolean; data?: Nurse; error?: string; authToken?: string }> {
  try {
    // Check if email already exists
    const { data: existingNurse } = await supabase
      .from('nurses')
      .select('id')
      .eq('email', nurseData.email)
      .single();

    if (existingNurse) {
      return { success: false, error: 'Email already exists' };
    }

    // Check if phone already exists
    if (nurseData.phone) {
      const { data: existingPhone } = await supabase
        .from('nurses')
        .select('id')
        .eq('phone', nurseData.phone)
        .single();

      if (existingPhone) {
        return { success: false, error: 'Phone number already exists' };
      }
    }

    // Hash password
    const passwordHash = await hashPassword(nurseData.password);

    // Handle job types - convert to array if it's a string
    let jobTypes: string[] = [];
    if (typeof nurseData.jobTypes === 'string') {
      // If it's a JSON string (starts with '['), parse it; otherwise treat as single value
      if (nurseData.jobTypes.startsWith('[')) {
        try {
          jobTypes = JSON.parse(nurseData.jobTypes);
        } catch {
          jobTypes = [nurseData.jobTypes];
        }
      } else {
        jobTypes = [nurseData.jobTypes];
      }
    } else if (Array.isArray(nurseData.jobTypes)) {
      jobTypes = nurseData.jobTypes;
    }

    // Insert nurse
    const { data: nurse, error } = await supabase
      .from('nurses')
      .insert({
        email: nurseData.email,
        password_hash: passwordHash,
        full_name: nurseData.fullName,
        phone: nurseData.phone,
        postcode: nurseData.postcode,
        current_residential_location: nurseData.currentResidentialLocation,
        job_types: jobTypes,
        open_to_other_types: nurseData.openToOtherTypes,
        shift_preferences: nurseData.shiftPreferences,
        start_time: nurseData.startTime,
        start_date: nurseData.startDate || null,
        job_search_status: nurseData.jobSearchStatus,
        qualification: nurseData.qualification,
        other_qualification: nurseData.otherQualification,
        working_in_healthcare: nurseData.workingInHealthcare,
        experience: nurseData.experience,
        organisation: nurseData.organisation,
        location_preference: nurseData.locationPreference,
        preferred_locations: nurseData.preferredLocations,
        certifications: nurseData.certifications,
        residency_status: nurseData.residencyStatus,
        visa_type: nurseData.visaType,
        visa_duration: nurseData.visaDuration,
        work_hours_restricted: nurseData.workHoursRestricted,
        max_work_hours: nurseData.maxWorkHours,
        terms_accepted: nurseData.termsAccepted,
        visibility_status: nurseData.visibilityStatus || 'visibleToAll',
      })
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return { success: false, error: error.message || 'Database error: ' + error.code };
    }

    // Generate a simple auth token (in production, use JWT)
    const authToken = `nurse_${nurse.id}_${Date.now()}`;

    return { success: true, data: nurse, authToken };
  } catch (err) {
    console.error('Nurse registration catch error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during registration';
    return { success: false, error: errorMessage };
  }
}

export async function loginNurse(email: string, password: string): Promise<{
  success: boolean;
  data?: Nurse;
  authToken?: string;
  error?: string;
}> {
  try {
    const passwordHash = await hashPassword(password);

    const { data: nurse, error } = await supabase
      .from('nurses')
      .select('*')
      .eq('email', email)
      .eq('password_hash', passwordHash)
      .single();

    if (error || !nurse) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Generate auth token
    const authToken = `nurse_${nurse.id}_${Date.now()}`;

    return { success: true, data: nurse, authToken };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'Login failed' };
  }
}

// =============================================
// EMPLOYER AUTHENTICATION
// =============================================

export async function registerEmployer(employerData: {
  email: string;
  password: string;
  fullName: string;
  mobile: string;
  companyName: string;
  australianBusinessNumber?: string;
  businessType?: string;
  numberOfEmployees?: string;
  yourDesignation?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  companyAddress?: string;
  organizationWebsite?: string;
  creatingAccountAs?: string;
}): Promise<{ success: boolean; data?: Employer; error?: string; authToken?: string }> {
  try {
    // Check if email already exists
    const { data: existingEmployer } = await supabase
      .from('employers')
      .select('id')
      .eq('email', employerData.email)
      .single();

    if (existingEmployer) {
      return { success: false, error: 'Email already exists' };
    }

    // Hash password
    const passwordHash = await hashPassword(employerData.password);

    // Insert employer
    const { data: employer, error } = await supabase
      .from('employers')
      .insert({
        email: employerData.email,
        password_hash: passwordHash,
        full_name: employerData.fullName,
        mobile: employerData.mobile,
        company_name: employerData.companyName,
        australian_business_number: employerData.australianBusinessNumber,
        business_type: employerData.businessType,
        number_of_employees: employerData.numberOfEmployees,
        your_designation: employerData.yourDesignation,
        state: employerData.state,
        city: employerData.city,
        pin_code: employerData.pinCode,
        company_address: employerData.companyAddress,
        organization_website: employerData.organizationWebsite,
        creating_account_as: employerData.creatingAccountAs,
        email_verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Employer registration error:', error);
      return { success: false, error: error.message };
    }

    // Generate auth token
    const authToken = `employer_${employer.id}_${Date.now()}`;

    return { success: true, data: employer, authToken };
  } catch (err) {
    console.error('Registration error:', err);
    return { success: false, error: 'Registration failed' };
  }
}

export async function loginEmployer(email: string, password: string): Promise<{
  success: boolean;
  data?: Employer;
  authToken?: string;
  error?: string;
}> {
  try {
    const passwordHash = await hashPassword(password);

    const { data: employer, error } = await supabase
      .from('employers')
      .select('*')
      .eq('email', email)
      .eq('password_hash', passwordHash)
      .single();

    if (error || !employer) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Generate auth token
    const authToken = `employer_${employer.id}_${Date.now()}`;

    return { success: true, data: employer, authToken };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: 'Login failed' };
  }
}

// =============================================
// OTP FUNCTIONS
// =============================================

export async function sendOTP(email: string, purpose: string): Promise<{
  success: boolean;
  otp?: string;
  error?: string;
}> {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    const { error } = await supabase
      .from('otp_tokens')
      .insert({
        email,
        otp_code: otp,
        purpose,
        expires_at: expiresAt.toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // In production, send email here using a service like SendGrid, Resend, etc.
    // For now, we'll return the OTP (for testing purposes)
    console.log(`OTP for ${email}: ${otp}`);

    return { success: true, otp };
  } catch (err) {
    console.error('Send OTP error:', err);
    return { success: false, error: 'Failed to send OTP' };
  }
}

export async function verifyOTP(email: string, otpCode: string, purpose: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { data: otpToken, error } = await supabase
      .from('otp_tokens')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otpCode)
      .eq('purpose', purpose)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !otpToken) {
      return { success: false, error: 'Invalid or expired OTP' };
    }

    // Mark OTP as used
    await supabase
      .from('otp_tokens')
      .update({ used: true })
      .eq('id', otpToken.id);

    return { success: true };
  } catch (err) {
    console.error('Verify OTP error:', err);
    return { success: false, error: 'OTP verification failed' };
  }
}

// =============================================
// PASSWORD RESET
// =============================================

export async function resetPassword(email: string, newPassword: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const passwordHash = await hashPassword(newPassword);

    // Try updating nurse first
    const { data: nurse } = await supabase
      .from('nurses')
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq('email', email)
      .select()
      .single();

    if (nurse) {
      return { success: true };
    }

    // Try updating employer
    const { data: employer, error } = await supabase
      .from('employers')
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq('email', email)
      .select()
      .single();

    if (error || !employer) {
      return { success: false, error: 'User not found' };
    }

    return { success: true };
  } catch (err) {
    console.error('Reset password error:', err);
    return { success: false, error: 'Password reset failed' };
  }
}

// =============================================
// TOKEN VALIDATION (Helper to extract user ID from token)
// =============================================

export function parseAuthToken(token: string): { role: 'nurse' | 'employer'; userId: string } | null {
  try {
    const parts = token.split('_');
    if (parts.length < 3) return null;

    const role = parts[0] as 'nurse' | 'employer';
    const userId = parts[1];

    if (role !== 'nurse' && role !== 'employer') return null;

    return { role, userId };
  } catch {
    return null;
  }
}

export async function getUserFromToken(token: string): Promise<Nurse | Employer | null> {
  const parsed = parseAuthToken(token);
  if (!parsed) return null;

  if (parsed.role === 'nurse') {
    const { data } = await supabase
      .from('nurses')
      .select('*')
      .eq('id', parsed.userId)
      .single();
    return data;
  } else {
    const { data } = await supabase
      .from('employers')
      .select('*')
      .eq('id', parsed.userId)
      .single();
    return data;
  }
}
