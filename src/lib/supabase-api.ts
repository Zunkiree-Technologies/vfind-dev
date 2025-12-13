import { supabase } from './supabase';
import type {
  Nurse,
  Employer,
  Job,
  Application,
  Education,
  WorkExperience,
  Connection,
  ContactMessage,
  SavedJob,
  EmployerWishlist,
} from './supabase';
import { parseAuthToken } from './supabase-auth';

// =============================================
// NURSE PROFILE OPERATIONS
// =============================================

export async function getNurseProfile(token: string): Promise<Nurse | null> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') return null;

  const { data } = await supabase
    .from('nurses')
    .select('*')
    .eq('id', parsed.userId)
    .single();

  return data;
}

export async function updateNurseProfile(
  token: string,
  updates: Partial<Omit<Nurse, 'id' | 'email' | 'password_hash'>>
): Promise<{ success: boolean; data?: Nurse; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('nurses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', parsed.userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function toggleNurseVisibility(
  token: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('nurses')
    .update({ visibility_status: status, updated_at: new Date().toISOString() })
    .eq('id', parsed.userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getAllNurses(): Promise<Nurse[]> {
  const { data } = await supabase
    .from('nurses')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getNursesForEmployers(): Promise<Nurse[]> {
  const { data } = await supabase
    .from('nurses')
    .select('*')
    .eq('visibility_status', 'visibleToAll')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getNurseById(id: string): Promise<Nurse | null> {
  const { data } = await supabase
    .from('nurses')
    .select('*')
    .eq('id', id)
    .single();

  return data;
}

export async function deleteNurse(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('nurses')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// =============================================
// EMPLOYER PROFILE OPERATIONS
// =============================================

export async function getEmployerProfile(token: string): Promise<Employer | null> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') return null;

  const { data } = await supabase
    .from('employers')
    .select('*')
    .eq('id', parsed.userId)
    .single();

  return data;
}

export async function updateEmployerProfile(
  token: string,
  updates: Partial<Omit<Employer, 'id' | 'email' | 'password_hash'>>
): Promise<{ success: boolean; data?: Employer; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('employers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', parsed.userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAllEmployers(): Promise<Employer[]> {
  const { data } = await supabase
    .from('employers')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getEmployerById(id: string): Promise<Employer | null> {
  const { data } = await supabase
    .from('employers')
    .select('*')
    .eq('id', id)
    .single();

  return data;
}

export async function deleteEmployer(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('employers')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// =============================================
// JOB OPERATIONS
// =============================================

export async function createJob(
  token: string,
  jobData: Omit<Job, 'id' | 'employer_id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: Job; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      ...jobData,
      employer_id: parsed.userId,
      status: 'Active',
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getJobs(filters?: {
  status?: string;
  location?: string;
  type?: string;
}): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*, employer:employers(*)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  const { data } = await query;
  return data || [];
}

export async function getActiveJobs(): Promise<Job[]> {
  const { data } = await supabase
    .from('jobs')
    .select('*, employer:employers(*)')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getEmployerJobs(token: string): Promise<Job[]> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') return [];

  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', parsed.userId)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getJobById(id: string): Promise<Job | null> {
  const { data } = await supabase
    .from('jobs')
    .select('*, employer:employers(*)')
    .eq('id', id)
    .single();

  return data;
}

export async function updateJob(
  token: string,
  jobId: string,
  updates: Partial<Omit<Job, 'id' | 'employer_id'>>
): Promise<{ success: boolean; data?: Job; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: existingJob } = await supabase
    .from('jobs')
    .select('employer_id')
    .eq('id', jobId)
    .single();

  if (!existingJob || existingJob.employer_id !== parsed.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('jobs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function deleteJob(
  token: string,
  jobId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify ownership
  const { data: existingJob } = await supabase
    .from('jobs')
    .select('employer_id')
    .eq('id', jobId)
    .single();

  if (!existingJob || existingJob.employer_id !== parsed.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function toggleJobStatus(
  token: string,
  jobId: string
): Promise<{ success: boolean; data?: Job; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  // Get current status
  const { data: job } = await supabase
    .from('jobs')
    .select('status, employer_id')
    .eq('id', jobId)
    .single();

  if (!job || job.employer_id !== parsed.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const newStatus = job.status === 'Active' ? 'Paused' : 'Active';

  const { data, error } = await supabase
    .from('jobs')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// =============================================
// APPLICATION OPERATIONS
// =============================================

export async function applyToJob(
  token: string,
  jobId: string
): Promise<{ success: boolean; data?: Application; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      nurse_id: parsed.userId,
      job_id: jobId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { success: false, error: 'Already applied to this job' };
    }
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAppliedJobs(token: string): Promise<Application[]> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') return [];

  const { data } = await supabase
    .from('applications')
    .select('*, job:jobs(*, employer:employers(*))')
    .eq('nurse_id', parsed.userId)
    .order('applied_at', { ascending: false });

  return data || [];
}

export async function getJobApplicants(token: string, jobId: string): Promise<Application[]> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') return [];

  // Verify job ownership
  const { data: job } = await supabase
    .from('jobs')
    .select('employer_id')
    .eq('id', jobId)
    .single();

  if (!job || job.employer_id !== parsed.userId) return [];

  const { data } = await supabase
    .from('applications')
    .select('*, nurse:nurses(*)')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });

  return data || [];
}

export async function getApplicantCount(jobId: string): Promise<number> {
  const { count } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('job_id', jobId);

  return count || 0;
}

// =============================================
// EDUCATION OPERATIONS
// =============================================

export async function getEducation(token: string): Promise<Education[]> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') return [];

  const { data } = await supabase
    .from('education')
    .select('*')
    .eq('nurse_id', parsed.userId)
    .order('from_year', { ascending: false });

  return data || [];
}

export async function addEducation(
  token: string,
  educationData: Omit<Education, 'id' | 'nurse_id' | 'created_at'>
): Promise<{ success: boolean; data?: Education; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('education')
    .insert({
      ...educationData,
      nurse_id: parsed.userId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateEducation(
  token: string,
  educationId: string,
  updates: Partial<Omit<Education, 'id' | 'nurse_id'>>
): Promise<{ success: boolean; data?: Education; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('education')
    .update(updates)
    .eq('id', educationId)
    .eq('nurse_id', parsed.userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function deleteEducation(
  token: string,
  educationId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', educationId)
    .eq('nurse_id', parsed.userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// =============================================
// WORK EXPERIENCE OPERATIONS
// =============================================

export async function getWorkExperience(token: string): Promise<WorkExperience[]> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') return [];

  const { data } = await supabase
    .from('work_experience')
    .select('*')
    .eq('nurse_id', parsed.userId)
    .order('start_date', { ascending: false });

  return data || [];
}

export async function addWorkExperience(
  token: string,
  experienceData: Omit<WorkExperience, 'id' | 'nurse_id' | 'created_at'>
): Promise<{ success: boolean; data?: WorkExperience; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('work_experience')
    .insert({
      ...experienceData,
      nurse_id: parsed.userId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateWorkExperience(
  token: string,
  experienceId: string,
  updates: Partial<Omit<WorkExperience, 'id' | 'nurse_id'>>
): Promise<{ success: boolean; data?: WorkExperience; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('work_experience')
    .update(updates)
    .eq('id', experienceId)
    .eq('nurse_id', parsed.userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function deleteWorkExperience(
  token: string,
  experienceId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('work_experience')
    .delete()
    .eq('id', experienceId)
    .eq('nurse_id', parsed.userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// =============================================
// SAVED JOBS (NURSE WISHLIST)
// =============================================

export async function saveJob(
  token: string,
  jobId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('saved_jobs')
    .insert({
      nurse_id: parsed.userId,
      job_id: jobId,
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Job already saved' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function unsaveJob(
  token: string,
  jobId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('nurse_id', parsed.userId)
    .eq('job_id', jobId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getSavedJobs(token: string): Promise<SavedJob[]> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') return [];

  const { data } = await supabase
    .from('saved_jobs')
    .select('*, job:jobs(*, employer:employers(*))')
    .eq('nurse_id', parsed.userId)
    .order('saved_at', { ascending: false });

  return data || [];
}

export async function isJobSaved(token: string, jobId: string): Promise<boolean> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') return false;

  const { data } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('nurse_id', parsed.userId)
    .eq('job_id', jobId)
    .single();

  return !!data;
}

export async function hasAppliedToJob(token: string, jobId: string): Promise<boolean> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') return false;

  const { data } = await supabase
    .from('applications')
    .select('id')
    .eq('nurse_id', parsed.userId)
    .eq('job_id', jobId)
    .single();

  return !!data;
}

// =============================================
// EMPLOYER WISHLIST
// =============================================

export async function saveNurseToWishlist(
  token: string,
  nurseId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('employer_wishlist')
    .insert({
      employer_id: parsed.userId,
      nurse_id: nurseId,
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Nurse already in wishlist' };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeNurseFromWishlist(
  token: string,
  nurseId: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('employer_wishlist')
    .delete()
    .eq('employer_id', parsed.userId)
    .eq('nurse_id', nurseId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getEmployerWishlist(token: string): Promise<EmployerWishlist[]> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') return [];

  const { data } = await supabase
    .from('employer_wishlist')
    .select('*, nurse:nurses(*)')
    .eq('employer_id', parsed.userId)
    .order('saved_at', { ascending: false });

  return data || [];
}

// =============================================
// CONNECTIONS
// =============================================

export async function getConnections(filters?: { status?: string }): Promise<Connection[]> {
  let query = supabase
    .from('connections')
    .select('*, employer:employers(*), nurse:nurses(*), job:jobs(*)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data } = await query;
  return data || [];
}

export async function getConnectionCount(status?: string): Promise<number> {
  let query = supabase
    .from('connections')
    .select('*', { count: 'exact', head: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { count } = await query;
  return count || 0;
}

// =============================================
// ADMIN STATISTICS
// =============================================

export async function getAdminStats(): Promise<{
  totalNurses: number;
  totalEmployers: number;
  totalJobs: number;
  acceptedConnections: number;
  pendingConnections: number;
  rejectedConnections: number;
}> {
  const [nurses, employers, jobs, accepted, pending, rejected] = await Promise.all([
    supabase.from('nurses').select('*', { count: 'exact', head: true }),
    supabase.from('employers').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('connections').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('connections').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('connections').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ]);

  return {
    totalNurses: nurses.count || 0,
    totalEmployers: employers.count || 0,
    totalJobs: jobs.count || 0,
    acceptedConnections: accepted.count || 0,
    pendingConnections: pending.count || 0,
    rejectedConnections: rejected.count || 0,
  };
}

// =============================================
// CONTACT FORM
// =============================================

export async function submitContactForm(
  data: Omit<ContactMessage, 'id' | 'created_at'>
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('contact_messages')
    .insert(data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// =============================================
// COMPANY PROFILE (ABOUT COMPANY)
// =============================================

export async function getCompanyProfile(token: string): Promise<{ about_company: string } | null> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') return null;

  const { data } = await supabase
    .from('employers')
    .select('about_company')
    .eq('id', parsed.userId)
    .single();

  return data;
}

export async function createCompanyProfile(
  token: string,
  aboutCompany: string
): Promise<{ success: boolean; data?: { about_company: string }; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('employers')
    .update({ about_company: aboutCompany, updated_at: new Date().toISOString() })
    .eq('id', parsed.userId)
    .select('about_company')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateCompanyProfile(
  token: string,
  aboutCompany: string
): Promise<{ success: boolean; data?: { about_company: string }; error?: string }> {
  return createCompanyProfile(token, aboutCompany); // Same operation
}

export async function deleteCompanyProfile(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'employer') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('employers')
    .update({ about_company: null, updated_at: new Date().toISOString() })
    .eq('id', parsed.userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// =============================================
// FILE UPLOAD HELPERS
// =============================================

export async function uploadProfileImage(
  token: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed) {
    return { success: false, error: 'Unauthorized' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${parsed.role}_${parsed.userId}_${Date.now()}.${fileExt}`;
  const bucket = parsed.role === 'nurse' ? 'profile-images' : 'employer-logos';

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { success: true, url: urlData.publicUrl };
}

export async function uploadDocument(
  token: string,
  file: File,
  type: 'photo_id' | 'certificate'
): Promise<{ success: boolean; url?: string; error?: string }> {
  const parsed = parseAuthToken(token);
  if (!parsed || parsed.role !== 'nurse') {
    return { success: false, error: 'Unauthorized' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${parsed.userId}_${type}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  // Documents bucket is private, so we get a signed URL
  const { data: urlData } = await supabase.storage
    .from('documents')
    .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days

  return { success: true, url: urlData?.signedUrl };
}
