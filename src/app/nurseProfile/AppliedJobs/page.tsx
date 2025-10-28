"use client";
import { useState, useEffect } from 'react';
import { Building2, MapPin, DollarSign, Calendar, Clock, Briefcase, ChevronLeft, ChevronRight, Clock1 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import Footer from '@/app/Admin/components/layout/Footer';

interface JobDetails {
  id: number;
  title: string;
  locality?: string;
  location?: string;
  minPay?: string;
  maxPay?: string;
  type?: string;
  JobShift?: string;
  description?: string;
  roleCategory?: string;
  experienceMin?: string;
  experienceMax?: string;
  created_at?: number;
  certifications?: string[];
  keyResponsibilities?: string;
  workEnvironment?: string;
  status?: string;
}

interface AppliedJob {
  id: number;
  jobs_id: number;
  status: string;
  applied_date: string;
  email: string;
  nurse_profiles_id?: number;
  _jobs?: JobDetails;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 1
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === totalPages
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const AppliedJobs = () => {
  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem('token');

      if (!authToken) {
        throw new Error('Authentication token not found. Please login.');
      }

      const response = await fetch(
        'https://x76o-gnx4-xrav.a2.xano.io/api:PX2mK6Kr/get_applied_jobs_for_nurse',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch applied jobs: ${response.statusText}`);
      }

      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending') || statusLower.includes('review') || statusLower === 'applied') {
      return 'bg-blue-400 text-white ';
    }
    if (statusLower.includes('accepted') || statusLower.includes('approved')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (statusLower.includes('rejected') || statusLower.includes('declined')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getCompanyName = (job: AppliedJob) => {
    return job._jobs?.locality || job._jobs?.location || 'Healthcare Facility';
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Fetching job data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchAppliedJobs}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="p-4 min-h-screen bg-[#F5F6FA]">
        <div className="flex gap-6 mt-6 items-start">
          <div className="mx-auto container flex justify-center items-center">
            <div className="flex-1 max-w-[983px]">
              <h1 className="text-3xl font-bold ml-2 text-primary mb-6">Applied Jobs</h1>

              {jobs.length === 0 ? (
                <div className="text-center bg-white rounded-lg p-12 shadow-sm">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Applied Jobs Yet
                  </h3>
                  <p className="text-gray-600">
                    Start applying to jobs to see them here
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {currentJobs.map((job) => {
                      const jobDetails = job._jobs;
                      return (
                        <a
                          key={job.id}
                          href={`/nurseProfile/jobapplicationpage/${job.jobs_id}?company=${encodeURIComponent(getCompanyName(job))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-between items-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-2 cursor-pointer"
                        >
                          <div className="flex-1">
                            <h2 className="font-semibold text-bold text-lg text-[#61A6FA] mb-1">
                              {jobDetails?.title || 'Job Title'}
                            </h2>

                            <p className="text-gray-600 text-sm mb-3 font-medium">
                              {getCompanyName(job)}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 text-sm">
                              {jobDetails?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={16} />
                                  <span>{jobDetails.location}</span>
                                </div>
                              )}

                              {jobDetails?.type && (
                                <div className="flex items-center gap-1">
                                  <Clock size={16} />
                                  <span>{jobDetails.type}</span>
                                </div>
                              )}

                              {(jobDetails?.experienceMin || jobDetails?.experienceMax) && (
                                <div className="flex items-center gap-1">
                                  <Calendar size={16} />
                                  <span>
                                    {jobDetails.experienceMin
                                      ? `${jobDetails.experienceMin}${jobDetails.experienceMax ? ` - ${jobDetails.experienceMax}` : ''} years`
                                      : 'Not specified'}
                                  </span>
                                </div>
                              )}

                              {(jobDetails?.minPay || jobDetails?.maxPay) && (
                                <div className="flex items-center gap-1">
                                  <DollarSign size={16} />
                                  <span>
                                    {jobDetails.minPay || jobDetails.maxPay
                                      ? `${jobDetails.minPay || '0'} - ${jobDetails.maxPay || '0'}/hr`
                                      : 'Not specified'}
                                  </span>
                                </div>
                              )}

                              {jobDetails?.roleCategory && (
                                <div className="flex items-center gap-1">
                                  <Briefcase size={16} />
                                  <span>{jobDetails.roleCategory}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-1">
                                <Clock1 size={16} />
                                <span>Applied {formatDate(job.applied_date)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 ml-6">
                            <span
                              className={`px-4 py-2 rounded-md text-sm font-medium border ${getStatusColor(
                                job.status
                              )}`}
                            >
                              {job.status}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}

              {jobs.length > 0 && currentJobs.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  No jobs found on this page.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>

  );
};

export default AppliedJobs;