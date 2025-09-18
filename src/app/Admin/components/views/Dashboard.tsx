"use client";

import { useEffect, useState } from "react";
import { Users, Building2, Briefcase, CheckCircle, Clock, XCircle, Link } from "lucide-react";

interface Stats {
  nurses: number;
  employers: number;
  jobs: number;
  accepted: number;
  pending: number;
  rejected: number;
  connections: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

 useEffect(() => {
  async function fetchStats() {
    try {
      const [
        nurses,
        employers,
        jobs,
        accepted,
        pending,
        rejected,
        connections,
      ] = await Promise.all([
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:MeLrTB-C/total_number_of_nurses").then((res) => res.json()),
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:t5TlTxto/total_number_of_employers").then((res) => res.json()),
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:W58sMfI8/total_number_of_jobs").then((res) => res.json()),
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/accepted_connections").then((res) => res.json()),
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/pending_connections").then((res) => res.json()),
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/rejected_connection").then((res) => res.json()),
        fetch("https://x8ki-letl-twmt.n7.xano.io/api:LP_rdOtV/total_number_of_connections").then((res) => res.json()),
      ]);

      // console.log("📊 Stats:", { nurses, employers, jobs, accepted, pending, rejected, connections });

      setStats({
        nurses,
        employers,
        jobs,
        accepted,
        pending,
        rejected,
        connections,
      });
    } catch (err) {
      console.error(" Error fetching stats:", err);
    }
  }

  fetchStats();
}, []);


  const cards = [
    { label: "Total Nurses", value: stats?.nurses, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { label: "Total Employers", value: stats?.employers, icon: <Building2 className="w-6 h-6 text-blue-500" /> },
    { label: "Total Job Posted", value: stats?.jobs, icon: <Briefcase className="w-6 h-6 text-blue-500" /> },
    { label: "Accepted Connections", value: stats?.accepted, icon: <CheckCircle className="w-6 h-6 text-green-500" /> },
    { label: "Pending Connections", value: stats?.pending, icon: <Clock className="w-6 h-6 text-yellow-500" /> },
    { label: "Rejected Connections", value: stats?.rejected, icon: <XCircle className="w-6 h-6 text-red-500" /> },
    { label: "Total Connections", value: stats?.connections, icon: <Link className="w-6 h-6 text-purple-500" /> },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6 mx-5 my-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5">
        {cards.map((card) => (
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
    </div>
  );
}
