"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, X, Link2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { parseAuthToken } from "@/lib/supabase-auth";

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
  const [successMessage] = useState<string>("");
  const [messageType] = useState<"success" | "error">("success");
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const parsed = parseAuthToken(token);
    if (!parsed || parsed.role !== 'nurse') return;

    try {
      setLoading(true);

      // Fetch pending connection requests for this nurse
      const { data, error } = await supabase
        .from('connections')
        .select('*, employer:employers(id, full_name, company_name)')
        .eq('nurse_id', parsed.userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      // Map to ConnectionRequest interface
      let mappedData: ConnectionRequest[] = (data || []).map((conn) => ({
        id: Number(conn.id),
        nurse_profiles_id: Number(conn.nurse_id),
        employer_profiles_id: Number(conn.employer_id),
        status: conn.status as "pending" | "accepted" | "rejected" | "",
        created_at: conn.created_at,
        _employer_profiles: conn.employer ? {
          id: Number(conn.employer.id),
          fullName: conn.employer.full_name,
          companyName: conn.employer.company_name,
        } : undefined,
      }));

      const hiddenIds: number[] = JSON.parse(localStorage.getItem("hiddenNotifications") || "[]");
      mappedData = mappedData.filter((item) => !hiddenIds.includes(item.id));

      const filtered = employerId
        ? mappedData.filter((item) => item.employer_profiles_id === employerId)
        : mappedData;

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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(req.id);
                    }}
                    className="absolute top-10 right-10 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition"
                    title="Dismiss notification"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>

                  <div
                    className="flex gap-4 px-2 py-2 border border-gray-200 rounded-lg cursor-pointer"
                    onClick={() => router.push(`/nurseProfile/connectedstatus/${req._employer_profiles?.id}`)}
                  >
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
                        <span className="font-medium text-gray-900 hover:underline">
                          {req._employer_profiles?.companyName ||
                            req._employer_profiles?.fullName ||
                            "N/A"}
                        </span>
                        .
                      </p>
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
          className="fixed inset-0  z-40 "
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