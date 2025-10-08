"use client";

import { useEffect, useState } from "react";
import { Users, Building2, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";

interface Stats {
  nurses: number;
  employers: number;
  jobs: number;
  accepted: number;
  pending: number;
  rejected: number;
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
        ] = await Promise.all([
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:MeLrTB-C/total_number_of_nurses").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/total_number_of_employers").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:W58sMfI8/total_number_of_jobs").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/accepted_connections").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/pending_connections").then((res) => res.json()),
          fetch("https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/rejected_connection").then((res) => res.json()),
        ]);

        setStats({
          nurses,
          employers,
          jobs,
          accepted,
          pending,
          rejected,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }

    fetchStats();
  }, []);

  const topCards = [
    { 
      label: "Total Nurses", 
      value: stats?.nurses, 
      icon: <Users className="w-5 h-5 text-blue-500" />
    },
    { 
      label: "Total Employers", 
      value: stats?.employers, 
      icon: <Building2 className="w-5 h-5 text-blue-500" />
    },
    { 
      label: "Total Job Posted", 
      value: stats?.jobs, 
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />
    },
  ];

  const connectionCards = [
    { 
      label: "Accepted Connections", 
      value: stats?.accepted, 
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      badge: "Accepted",
      badgeColor: "bg-green-100 text-green-700"
    },
    { 
      label: "Pending Connections", 
      value: stats?.pending, 
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      badge: "Pending",
      badgeColor: "bg-orange-100 text-orange-600"
    },
    { 
      label: "Rejected Connections", 
      value: stats?.rejected, 
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      badge: "Rejected",
      badgeColor: "bg-red-100 text-red-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {card.icon}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {card.value?.toLocaleString() ?? "..."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row - 3 Cards with Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {connectionCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  card.badge === "Accepted" ? "bg-green-50" : 
                  card.badge === "Pending" ? "bg-orange-50" : 
                  "bg-red-50"
                }`}>
                  {card.icon}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value?.toLocaleString() ?? "..."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}