"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Link2, X } from "lucide-react";
import { useRouter } from 'next/navigation';


interface Notification {
  id: number;
  status: "pending" | "accepted" | "rejected" | "";
  created_at: string;
  nurseName: string;
  nurse_profiles_id: number;
  employerName: string;
  message?: string;
}

interface NotificationSidebarProps {
  employerId?: number;
}

export default function EmployerNotificationSidebar({ }: NotificationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
    const router = useRouter();
  

  // Get user-specific storage key
  const getStorageKey = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return "hiddenNotifications_employer";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id || payload.user_id || payload.sub;
      return userId ? `hiddenNotifications_employer_${userId}` : "hiddenNotifications_employer";
    } catch {
      return "hiddenNotifications_employer";
    }
  };

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/getEmployerNotifications",
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch notifications");

      let data: Notification[] = await res.json();

      // Filter hidden notifications
      const hiddenIds: number[] = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
      data = data.filter((n) => !hiddenIds.includes(n.id));

      // Filter out pending notifications - only show accepted and rejected
      data = data.filter((n) => n.status === "accepted" || n.status === "rejected");

      // Sort newest first
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          // Show toast for new notifications
          if (data.length > prev.length) {
            const latest = data[0];
            if (latest.status === "accepted") {
              setToastType("success");
              setToastMessage(
                `Great news! ${latest.nurseName} has accepted your connection request.`
              );
            } else if (latest.status === "rejected") {
              setToastType("error");
              setToastMessage(
                `Your connection request to ${latest.nurseName} was declined.`
              );
            }
            setTimeout(() => setToastMessage(""), 5000);
          }
          return data;
        }
        return prev;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleSidebar = () => setIsOpen(!isOpen);

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const storageKey = getStorageKey();
    const hiddenIds: number[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!hiddenIds.includes(id)) localStorage.setItem(storageKey, JSON.stringify([...hiddenIds, id]));
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[521px] h-full max-h-[572px] bg-white shadow-2xl transform transition-transform duration-300 z-50 rounded-b-lg ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="font-bold text-xl text-gray-800">Notifications</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition"
          >
            <X className="w-5 h-5 text-gray-500" />

          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-72px)] space-y-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">No notifications</p>
          ) : (
            notifications.map((note) => (
              <div
                onClick={() => router.push(`/EmployerDashboard/Candidatelist/${note.nurse_profiles_id}`)}
                key={note.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-lg transition bg-gray-50 cursor-pointer"
              >
                {/* Left Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-blue-400" />
                  </div>
                </div>

                {/* Middle message */}
                <p
                  className={`flex-1 mx-4 text-sm hover:underline ${note.status === "accepted"
                    ? "text-green-700"
                    : note.status === "rejected"
                      ? "text-red-700"
                      : "text-gray-800"
                    }`}
                >
                  {note.message ||
                    (note.status === "accepted"
                      ? `${note.nurseName} accepted your request`
                      : note.status === "rejected"
                        ? `${note.nurseName} rejected your request`
                        : `Request ${note.status} with ${note.nurseName}`)}
                </p>

                {/* Right X button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0  z-40" onClick={() => setIsOpen(false)} />}

      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm transition-all duration-300 transform ${toastType === "success"
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-red-100 text-red-800 border border-red-300"
            }`}
        >
          {toastMessage}
        </div>
      )}
    </>
  );
}
