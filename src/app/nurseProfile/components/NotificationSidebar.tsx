"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Trash2 } from "lucide-react";

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

    setLoading(true);
    try {
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

  const handleToggleSidebar = async () => {
    if (!isOpen) await fetchNotifications();
    setIsOpen(!isOpen);
  };

  // Refresh every 30s while open
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => fetchNotifications(), 30000);
    return () => clearInterval(timer);
  }, [isOpen, fetchNotifications]);

  const handleUpdateStatus = async (requestId: number, newStatus: "accepted" | "rejected") => {
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
      } else if (newStatus === "rejected") {
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

  const handleDelete = (requestId: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== requestId));
    const hiddenIds: number[] = JSON.parse(localStorage.getItem("hiddenNotifications") || "[]");
    if (!hiddenIds.includes(requestId)) {
      localStorage.setItem("hiddenNotifications", JSON.stringify([...hiddenIds, requestId]));
    }
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
          className="p-2 rounded-full hover:bg-gray-200 transition relative"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {requests.filter((r) => r.status === "pending").length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
              {requests.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-5 right-5 h-[75%] w-[360px] bg-white rounded-xl shadow-2xl transform transition-transform duration-500 z-50 overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="font-bold text-xl text-gray-800">Notifications</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-72px)] space-y-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">No notifications</p>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="flex gap-3 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-white font-bold text-lg">
                    {req._employer_profiles?.companyName?.[0] ||
                      req._employer_profiles?.fullName?.[0] ||
                      "N"}
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-gray-800">
                    You have received a connection request from{" "}
                    <span className="font-semibold text-blue-600">
                      {req._employer_profiles?.companyName ||
                        req._employer_profiles?.fullName ||
                        "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Review and respond to continue.</p>
                  <p className="text-sm text-gray-500 mt-1">Status: {req.status}</p>
                  {req.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(req.created_at).toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "accepted")}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition flex-1"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "rejected")}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition flex-1"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {req.status === "accepted" && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                        Connected
                      </span>
                    )}
                    {req.status === "rejected" && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold text-sm">
                        Rejected
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="ml-auto text-gray-500 hover:text-red-600 transition"
                      title="Delete notification"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toast Message */}
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
    </>
  );
}
