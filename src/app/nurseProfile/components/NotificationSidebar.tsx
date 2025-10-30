"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, X, Link2 } from "lucide-react";

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
  };
}

interface NotificationSidebarProps {
  employerId?: number;
}

export default function NotificationSidebar({ employerId }: NotificationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/getNurseNotifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch notifications");

      let data: ConnectionRequest[] = await res.json();

      const hiddenIds: number[] = JSON.parse(localStorage.getItem("hiddenNotifications") || "[]");
      data = data.filter((item) => !hiddenIds.includes(item.id));

      const filtered = employerId
        ? data.filter((item) => item.employer_profiles_id === employerId)
        : data;

      filtered.sort((a, b) => b.id - a.id);

      setRequests((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(filtered)) return filtered;
        return prev;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [employerId]);

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleUpdateStatus = async (requestId: number, newStatus: "accepted" | "rejected") => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    try {
      const affectedRequest = requests.find((r) => r.id === requestId);
      if (!affectedRequest) throw new Error("Request not found");

      const res = await fetch(
        `https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/connections/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            connections_id: requestId,
            employer_profiles_id: affectedRequest.employer_profiles_id,
            nurse_profiles_id: affectedRequest.nurse_profiles_id,
            status: newStatus,
          }),
        }
      );

      let updatedData: Partial<ConnectionRequest> = {};
      if (res.status !== 204) {
        updatedData = await res.json().catch(() => ({}));
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus, ...updatedData } : req
        )
      );

      const employerName =
        affectedRequest._employer_profiles?.companyName ||
        affectedRequest._employer_profiles?.fullName ||
        "Employer";

      if (newStatus === "accepted") {
        setMessageType("success");
        setSuccessMessage(
          `You've successfully connected with ${employerName}. You will soon receive a confirmation email with further details from the employer.`
        );
      } else if (newStatus === "rejected") {
        setMessageType("error");
        setSuccessMessage(
          `You have declined the connection request from ${employerName}. No further action is required.`
        );
      }

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update request");
    }
  };

  const handleDelete = (requestId: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== requestId));
    const hiddenIds: number[] = JSON.parse(localStorage.getItem("hiddenNotifications") || "[]");
    if (!hiddenIds.includes(requestId)) {
      localStorage.setItem("hiddenNotifications", JSON.stringify([...hiddenIds, requestId]));
    }
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Bell Icon */}
      <div className="relative">
        <button
          onClick={handleToggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 transition relative"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {requests.filter((r) => r.status === "pending").length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
              {requests.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[521px] h-full max-h-[572px] bg-white shadow-2xl transform transition-transform duration-300 z-50 rounded-b-lg ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-100">
          <h2 className="text-xl font-regular text-gray-900">Notifications</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-64px)] ">
          {loading ? (
            <div className="p-6 space-y-4">
              <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 hover:bg-gray-50 transition relative group"
                >
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(req.id)}
                    className="absolute top-10 right-10 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition"
                    title="Dismiss notification"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>

                  <div className="flex gap-4 px-2 py-2 border border-gray-200 rounded-lg">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        New Connection Request Received
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        You&apos;ve received a new connection request from{" "}
                        <span className="font-medium text-gray-900">
                          {req._employer_profiles?.companyName ||
                            req._employer_profiles?.fullName ||
                            "N/A"}
                        </span>
                        .
                      </p>

                      {/* Action Buttons */}
                      {req.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleUpdateStatus(req.id, "accepted")}
                            className="flex-1 px-4 py-2 bg-blue-400 text-white text-sm font-medium rounded-lg  transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "rejected")}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {req.status === "accepted" && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Connected
                          </span>
                        </div>
                      )}

                      {req.status === "rejected" && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Declined
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toast Message */}
      {successMessage && (
        <div
          className={`fixed top-6 right-6 z-[60] max-w-md px-4 py-3 rounded-lg shadow-xl text-sm transition-all duration-300 ${messageType === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
            }`}
        >
          {successMessage}
        </div>
      )}
    </>
  );
}