"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Filter, Search, Mail, User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Loader from "../../../../../components/loading";

interface JobApplication {
  id: number;
  created_at: number;
  jobs_id: number;
  nurse_profiles_id: number;
  status: "applied" | "invited" | "rejected" | "hired";
  applied_date: string;
  email: string;
  fullName?: string;
}

const JobApplicationsPage = () => {
  const { id } = useParams(); // Job ID from URL
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "status" | "email">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Unauthorized. Please login.");
      router.push("/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:PX2mK6Kr/getAllNursesAppliedForJob?job_id=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setApplications(data);
        console.log(data)
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id, router]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-800 border-blue-200";
      case "invited": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "hired": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied": return <Clock className="w-4 h-4" />;
      case "invited": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "hired": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredAndSortedApplications = applications
    .filter(app => {
      const matchesSearch = app.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.applied_date).getTime() - new Date(b.applied_date).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const statusCounts = {
    all: applications.length,
    applied: applications.filter(app => app.status === "applied").length,
    invited: applications.filter(app => app.status === "invited").length,
    rejected: applications.filter(app => app.status === "rejected").length,
    hired: applications.filter(app => app.status === "hired").length,
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader loading={true} message="Loading jobs..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and review nurse applications for Job #{id}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {applications.length} Total Applications
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters/Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Status ({statusCounts.all})</option>
                  <option value="applied">Applied ({statusCounts.applied})</option>
                  <option value="invited">Invited ({statusCounts.invited})</option>
                  <option value="rejected">Rejected ({statusCounts.rejected})</option>
                  <option value="hired">Hired ({statusCounts.hired})</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as "date" | "status" | "email")}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="email">Sort by Email</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Cards */}
        <div className="mt-6 space-y-4">
          {filteredAndSortedApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "No nurses have applied for this job yet."}
              </p>
            </div>
          ) : (
            filteredAndSortedApplications.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 truncate">{app.email}</p>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Applied: {new Date(app.applied_date).toLocaleDateString()}</span>
                        </div>


                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {getStatusIcon(app.status)}
                      <span className="capitalize">{app.status}</span>
                    </span>

                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => router.push(`/EmployerDashboard/Candidatelist/${app.nurse_profiles_id}`)}
                      >
                        View Profile
                      </button>


                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPage;
