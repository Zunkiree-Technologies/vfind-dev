import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Nurse {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  phone_number?: string;
  postcode?: string;
  current_residential_location?: string;
  job_types?: string[];
  open_to_other_types?: string;
  shift_preferences?: string[];
  start_time?: string;
  start_date?: string;
  job_search_status?: string;
  qualification?: string;
  other_qualification?: string;
  working_in_healthcare?: string;
  experience?: string;
  organisation?: string;
  location_preference?: string;
  preferred_locations?: string[];
  certifications?: string[];
  licenses?: string[];
  residency_status?: string;
  visa_type?: string;
  visa_status?: string;
  visa_duration?: string;
  visa_expiry?: string;
  work_hours_restricted?: string;
  max_work_hours?: string;
  willing_to_relocate?: string;
  ahpra_registration?: string;
  registration_number?: string;
  ahpra_registration_expiry?: string;
  resume_url?: string;
  visibility_status?: string;
  profile_image_url?: string;
  photo_id_url?: string;
  terms_accepted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Employer {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  mobile?: string;
  company_name: string;
  australian_business_number?: string;
  business_type?: string;
  number_of_employees?: string;
  your_designation?: string;
  designation?: string;
  state?: string;
  city?: string;
  pin_code?: string;
  country?: string;
  company_address?: string;
  organization_website?: string;
  website_link?: string;
  creating_account_as?: string;
  account_type?: string;
  logo_url?: string;
  company_logo_url?: string;
  about_company?: string;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  location: string;
  locality?: string;
  type: string;
  min_pay?: string;
  max_pay?: string;
  description?: string;
  role_category?: string;
  experience_min?: string;
  experience_max?: string;
  job_shift?: string;
  language_requirements?: string[];
  certifications?: string[];
  key_responsibilities?: string;
  work_environment?: string;
  visa_requirement?: string;
  status?: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
  // Joined data
  employer?: Employer;
  applicants_count?: number;
}

export interface Application {
  id: string;
  nurse_id: string;
  job_id: string;
  status?: string;
  applied_at?: string;
  // Joined data
  nurse?: Nurse;
  job?: Job;
}

export interface Education {
  id: string;
  nurse_id: string;
  institution_name: string;
  degree_name: string;
  from_year?: string;
  to_year?: string;
  created_at?: string;
}

export interface WorkExperience {
  id: string;
  nurse_id: string;
  organization_name: string;
  role_title: string;
  total_years?: string;
  total_years_of_experience?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface Connection {
  id: string;
  employer_id: string;
  nurse_id: string;
  job_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Joined data
  employer?: Employer;
  nurse?: Nurse;
  job?: Job;
}

export interface OTPToken {
  id: string;
  email: string;
  otp_code: string;
  purpose: string;
  expires_at: string;
  used?: boolean;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name?: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface SavedJob {
  id: string;
  nurse_id: string;
  job_id: string;
  saved_at?: string;
  // Joined data
  job?: Job;
}

export interface EmployerWishlist {
  id: string;
  employer_id: string;
  nurse_id: string;
  saved_at?: string;
  // Joined data
  nurse?: Nurse;
}
