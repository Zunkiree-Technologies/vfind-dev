"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Clock, CheckCircle, XCircle } from "lucide-react";
import Loader from "../../../../components/loading";

interface StatusItem {
  id: number;
  status: "pending" | "accepted" | "rejected" | string;
  created_at: string;
  nurseName: string;
  nurse_profiles_id: number;
}

export default function StatusPage() {
  const router = useRouter();
  const [data, setData] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/getEmployerNotifications",
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch data: ${await res.text()}`);

      const apiData: StatusItem[] = await res.json();
      apiData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setData(apiData);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.nurseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || item.status === statusFilter)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader loading={true} message="Loading status updates..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Status Updates</h1>
            <p className="mt-1 text-sm text-gray-500">
              View latest applicant statuses
            </p>
          </div>
          <span className="mt-4 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {data.length} Total Updates
          </span>
        </div>
      </div>

      {/* Filters/Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by applicant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Status Cards */}
        <div className="mt-6 space-y-4">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No status updates found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                onClick={() => router.push(`/EmployerDashboard/Candidatelist/${item.nurse_profiles_id}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.nurseName}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-300">
                    {getStatusIcon(item.status)}
                    <span className="capitalize">{item.status}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/EmployerDashboard/Candidatelist/${item.nurse_profiles_id}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
