"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Clock, CheckCircle, XCircle } from "lucide-react";

interface ConnectionRequest {
  id: number;
  nurse_profiles_id: number;
  employer_profiles_id: number;
  status: "pending" | "accepted" | "rejected" | "";
  created_at?: string;
  _employer_profiles?: {
    id: number;
    fullName?: string;
    companyName?: string;
    email?: string;
    mobile?: string;
  };
}

export default function NurseStatusPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const fetchRequests = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/getNurseNotifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch requests");
      let data: ConnectionRequest[] = await res.json();

      const hiddenIds: number[] = JSON.parse(
        localStorage.getItem("hiddenNotifications") || "[]"
      );
      data = data.filter((item) => !hiddenIds.includes(item.id));

      data.sort((a, b) => b.id - a.id);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (
    requestId: number,
    newStatus: "accepted" | "rejected"
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    try {
      const res = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/connections/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update request");

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      const affectedRequest = requests.find((r) => r.id === requestId);
      const employerName =
        affectedRequest?._employer_profiles?.companyName ||
        affectedRequest?._employer_profiles?.fullName ||
        "Employer";

      if (newStatus === "accepted") {
        setMessageType("success");
        setSuccessMessage(
          `You’ve successfully connected with ${employerName}. You will soon receive a confirmation email with further details from the employer.`
        );
      } else {
        setMessageType("error");
        setSuccessMessage(
          `You have declined the connection request from ${employerName}. No further action is required.`
        );
      }

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  const handleCardClick = (employerId: number | undefined) => {
    if (!employerId) return;
    router.push(`/nurseProfile/connectedstatus/${employerId}`);
  };

  const filteredRequests = requests.filter(
    (req) =>
      (req._employer_profiles?.companyName?.toLowerCase() || "")
        .includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || req.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border border-yellow-300 bg-yellow-50 text-yellow-700">
            <Clock className="w-3 h-3" /> <span>Pending</span>
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border border-green-300 bg-green-50 text-green-700">
            <CheckCircle className="w-3 h-3" /> <span>Connected</span>
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border border-red-300 bg-red-50 text-red-700">
            <XCircle className="w-3 h-3" /> <span>Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Connection Requests</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage requests from employers
            </p>
          </div>
          <span className="mt-4 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {requests.length} Total Requests
          </span>
        </div>
      </div>

      {/* Filters/Search */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by employer name..."
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

        {/* Cards */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No requests found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => handleCardClick(req._employer_profiles?.id)}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {req._employer_profiles?.companyName ||
                        req._employer_profiles?.fullName ||
                        "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {req.created_at
                        ? new Date(req.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                  {getStatusBadge(req.status)}
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(req.id, "accepted");
                        }}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(req.id, "rejected");
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast */}
      {successMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm transition-all duration-300 transform ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
}
