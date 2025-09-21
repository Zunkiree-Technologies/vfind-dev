"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Link as LinkIcon,
  Building2,
  Filter,
} from "lucide-react";

interface Stats {
  nurses: number;
  employers: number;
  jobs: number;
  accepted: number;
  pending: number;
  rejected: number;
  connections: number;
}

interface Connection {
  id: number;
  employer_profiles_id: number;
  nurse_profiles_id: number;
  nurseName: string;
  employerName?: string; 
  status: "accepted" | "pending" | "rejected";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filter, setFilter] = useState<"All Status" | "accepted" | "pending" | "rejected">("All Status");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Fetch stats
        const [accepted, pending, rejected, connectionsCount] = await Promise.all([
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/accepted_connections").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/pending_connections").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/rejected_connection").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/total_number_of_connections").then((res) => res.json()),
        ]);

        setStats({
          nurses: 0, 
          employers: 0,
          jobs: 0,
          accepted,
          pending,
          rejected,
          connections: connectionsCount,
        });

        // ✅ Fetch connections for table
        const conns = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/connections"
        ).then((res) => res.json());

        setConnections(Array.isArray(conns) ? conns : []);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    { label: "Accepted Connections", value: stats?.accepted, icon: <CheckCircle className="w-6 h-6 text-green-500" /> },
    { label: "Pending Connections", value: stats?.pending, icon: <Clock className="w-6 h-6 text-yellow-500" /> },
    { label: "Rejected Connections", value: stats?.rejected, icon: <XCircle className="w-6 h-6 text-red-500" /> },
    { label: "Total Connections", value: stats?.connections, icon: <LinkIcon className="w-6 h-6 text-purple-500" /> },
  ];

  const statusConfig = {
    accepted: { icon: CheckCircle, color: "text-green-500" },
    pending: { icon: Clock, color: "text-yellow-500" },
    rejected: { icon: XCircle, color: "text-red-500" },
  };

  const filteredConnections =
    filter === "All Status"
      ? connections
      : connections.filter((c) => c.status === filter);

  return (
    <div className="p-6">
      {/* Dashboard Stats */}
      <h1 className="text-xl font-semibold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-6 bg-white rounded-lg shadow flex flex-col items-center justify-center text-center"
          >
            <div className="mb-2">{card.icon}</div>
            <h2 className="text-sm font-medium text-gray-500">{card.label}</h2>
            <p className="text-2xl font-bold mt-1">{card.value ?? "..."}</p>
          </div>
        ))}
      </div>

      {/* Connections Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-[18px] font-bold text-gray-800">All Connections</h2>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 text-sm"
            >
              <Filter className="w-4 h-4" /> {filter}
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow rounded w-40 text-sm z-10">
                {["All Status", "accepted", "pending", "rejected"].map((option) => (
                  <div
                    key={option}
                    className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                      filter === option ? "bg-gray-50 font-medium" : ""
                    }`}
                    onClick={() => {
                      setFilter(option as typeof filter);
                      setFilterOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      <table className="w-full text-sm">
  <thead>
    <tr className="border-b border-gray-300">
      <th className="p-2 text-left w-1/3 text-medium">Employer</th>
      <th className="p-2 text-left w-1/3 text-medium">Nurse</th>
      <th className="p-2 text-left w-1/3 text-medium">Status</th>
    </tr>
  </thead>
  <tbody>
    {filteredConnections.map((conn) => {
      const StatusIcon = statusConfig[conn.status].icon;
      return (
        <tr key={conn.id} className="border-b border-gray-300">
          {/* Employer */}
          <td className="p-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              {conn.employerName || `Employer #${conn.employer_profiles_id}`}
            </div>
          </td>

          {/* Nurse */}
          <td className="p-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                {conn.nurseName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              {conn.nurseName}
            </div>
          </td>

          {/* Status */}
          <td className="p-2">
            <div className="flex items-center gap-1 capitalize">
              <StatusIcon className={`w-4 h-4 ${statusConfig[conn.status].color}`} />
              {conn.status}
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>


        {filteredConnections.length === 0 && (
          <p className="text-center text-gray-500 py-6">No connections found</p>
        )}
      </div>
    </div>
  );
}
