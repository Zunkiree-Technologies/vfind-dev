"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Trash2 } from "lucide-react";

interface Notification {
  id: number;
  status: string;
  created_at: string;
  nurseName: string;
  nurse_profiles_id: number;
  employerName: string;
  message?: string;
}

export default function NotificationSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasNew, setHasNew] = useState(false);

  // toast state
  const [, setToastMessage] = useState<string>("");
  const [, setToastType] = useState<"success" | "error">("success");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchNotifications = async (silent = false) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/getEmployerNotifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch notifications: ${text}`);
      }

      let data: Notification[] = await res.json();
      const hiddenIds: number[] = JSON.parse(localStorage.getItem("hiddenNotifications") || "[]");
      data = data.filter((n) => !hiddenIds.includes(n.id));

      // build the right message based on status
      const mapped = data.map((n) => {
        if (n.status === "accepted") {
          return {
            ...n,
            message: `Great news! ${n.nurseName} has accepted your connection request. You can now proceed to contact them directly.`,
          };
        } else if (n.status === "rejected") {
          return {
            ...n,
            message: `Your connection request to ${n.nurseName} was declined. You may continue exploring other candidates in the Talent Pool.`,
          };
        } else {
          return {
            ...n,
            message: `Connection request ${n.status} with  ${n.nurseName}`,
          };
        }
      });

      mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications((prev) => {
        const prevIds = prev.map((p) => p.id).join(",");
        const newIds = mapped.map((m) => m.id).join(",");
        if (prevIds !== newIds) {
          setHasNew(mapped.length > 0);

          // check latest notification for toast
          if (mapped.length > 0) {
            const latest = mapped[0];
            if (latest.status === "accepted") {
              setToastType("success");
              setToastMessage(
                `Great news! ${latest.nurseName} has accepted your connection request. You can now proceed to contact them directly.`
              );
            } else if (latest.status === "rejected") {
              setToastType("error");
              setToastMessage(
                `Your connection request to ${latest.nurseName} was declined. You may continue exploring other candidates in the Talent Pool.`
              );
            }
            setTimeout(() => setToastMessage(""), 5000);
          }

          return mapped;
        }
        return prev;
      });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const hiddenIds: number[] = JSON.parse(localStorage.getItem("hiddenNotifications") || "[]");
    localStorage.setItem("hiddenNotifications", JSON.stringify([...hiddenIds, id]));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(true), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Notification Icon */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setHasNew(false);
          }}
          className="p-2 rounded-full hover:bg-gray-200 transition relative"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {hasNew && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
              {notifications.length}
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
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">No notifications</p>
          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                className="flex flex-col gap-2 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition bg-gray-50"
              >
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/EmployerDashboard/Candidatelist/${note.nurse_profiles_id}`)
                  }
                >
                  <p
                    className={`text-sm ${
                      note.status === "accepted"
                        ? "text-green-700"
                        : note.status === "rejected"
                        ? "text-red-700"
                        : "text-gray-800"
                    }`}
                  >
                    {note.message}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-end mt-2 gap-2">
                  <button
                    onClick={() => deleteNotification(note.id)}
                    className="text-red-500 hover:text-red-700 transition flex-shrink-0"
                    title="Delete notification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setIsOpen(false)} />
      )}

    </>
  );
}
