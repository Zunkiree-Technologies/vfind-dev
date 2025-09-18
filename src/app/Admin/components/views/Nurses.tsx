"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Search, Filter } from "lucide-react";

interface Nurse {
  id: number;
  fullName?: string;
  email?: string;
  qualification?: string;
  startDate?: string;
}


export default function NursesPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All Time");

 useEffect(() => {
  async function fetchNurses() {
    try {
      const res = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:t5TlTxto/nurse_profiles_admin"
      );
      const data = await res.json();
      // console.log("Nurses API response:", data); 

      if (Array.isArray(data)) {
        setNurses(data);
      } else if (Array.isArray(data.nurses)) {
        setNurses(data.nurses);
      } else {
        console.error("Unexpected API response format", data);
        setNurses([]); 
      }
    } catch (err) {
      console.error(" Error fetching nurses:", err);
    }
  }
  fetchNurses();
}, []);


  const applyDateFilter = (nurse: Nurse) => {
    if (!nurse.startDate) return false;
    if (selectedFilter === "All Time") return true;

    const created = new Date(nurse.startDate);
    const now = new Date();

    switch (selectedFilter) {
      case "Last 24 Hours":
        return created >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "Last 7 Days":
        return created >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "Last 30 Days":
        return created >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "Last 6 Months":
        return created >= new Date(now.setMonth(now.getMonth() - 6));
      default:
        return true;
    }
  };

  const filteredNurses = nurses
    .filter((nurse) =>
      (nurse?.fullName || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter(applyDateFilter);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6 mx-4 my-4">Nurses Overview</h1>
      <div className="px-5">
        <div className="bg-white shadow rounded-lg p-4   mx-auto container">
          {/* Header: Search + Filter */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px]  font-bold text-gray-800 mb-4">
              Registered Nurses
            </h2>

            <div className="flex item-center justify-around gap-4">
              <div className="flex items-center gap-2 border border-gray-400 rounded px-2 py-1 w-72">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none flex-1 text-sm"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 text-sm"
                >
                  <Filter className="w-4 h-4" /> All Time
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow rounded w-40 text-sm">
                    {["All Time", "Last 24 Hours", "Last 7 Days", "Last 30 Days", "Last 6 Months"].map(
                      (option) => (
                        <div
                          key={option}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedFilter === option ? "bg-gray-50 font-medium" : ""
                            }`}
                          onClick={() => {
                            setSelectedFilter(option);  
                            setFilterOpen(false);
                          }}
                        >
                          {option}
                        </div>
                      )
                    )}

                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className=" text-left border border-gray-400 rounded-tl-[10px] rounded-tr-[10px]">

                <th className="p-2 font-medium">Nurse </th>
                <th className="p-2 font-medium">Email</th>
                <th className="p-2 font-medium">Role</th>
                <th className="p-2 font-medium">Created At</th>
                <th className="p-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredNurses.map((nurse) => (
                <tr key={nurse.id} className="border-t border-gray-300">
                  <td className="p-2 font-regular">{nurse.fullName || "—"}</td>
                  <td className="p-2 font-regular">{nurse.email || "—"}</td>
                  <td className="p-2 font-regular">{nurse.qualification || "—"}</td>
                  <td className="p-2 font-regular">
                    {nurse.startDate
                      ? new Date(nurse.startDate).toISOString().split("T")[0]
                      : "—"}
                  </td>

                  <td className="p-2 text-right relative">
                    <button
                      onClick={() =>
                        setActionOpen(actionOpen === nurse.id ? null : nurse.id)
                      }
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {actionOpen === nurse.id && (
                      <div className="absolute right-0 mt-2 bg-white shadow rounded w-28 text-sm">
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => alert(`Preview nurse: ${nurse.fullName}`)}
                        >
                          Preview
                        </div>
                        <div
                          className="px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => alert(`Delete nurse: ${nurse.fullName}`)}
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredNurses.length === 0 && (
            <p className="text-center text-gray-500 py-6">No nurses found</p>
          )}
        </div>
      </div>
    </div>
  );
}
