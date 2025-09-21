"use client";

import { useEffect, useState, useRef } from "react";
import { MoreVertical, Search, Filter, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Employer {
  id: number;
  companyName?: string;
  email?: string;
  companyAddress?: string;
  created_at?: string;
}

export default function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Time");
  const [actionOpen, setActionOpen] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(e.target as Node)
      ) {
        setActionOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchEmployers() {
      try {
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/employer_profiles"
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setEmployers(data);
        } else if (Array.isArray(data.employers)) {
          setEmployers(data.employers);
        } else {
          console.error("Unexpected API response format", data);
          setEmployers([]);
        }
      } catch (err) {
        console.error("Error fetching employers:", err);
        setEmployers([]);
      }
    }
    fetchEmployers();
  }, []);

  const applyDateFilter = (employer: Employer) => {
    if (!employer.created_at) return false;
    if (selectedFilter === "All Time") return true;

    const created = new Date(employer.created_at);
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

  // Combine search + filter
  const filteredEmployers = employers
    .filter((employer) =>
      (employer?.companyName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter(applyDateFilter);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6 mx-4 my-4">
        Employers Overview
      </h1>
      <div className="px-5">
        <div className="bg-white shadow rounded-lg p-4 mx-auto container">
          {/* Header: Search + Filter */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-gray-800 mb-4">
              Registered Employers
            </h2>

            <div className="flex item-center justify-around gap-4">
              {/* Search */}
              <div className="flex items-center gap-2 border border-gray-400 rounded px-2 py-1 w-72">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none flex-1 text-sm"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 text-sm"
                >
                  <Filter className="w-4 h-4" /> {selectedFilter}
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow rounded w-40 text-sm">
                    {[
                      "All Time",
                      "Last 24 Hours",
                      "Last 7 Days",
                      "Last 30 Days",
                      "Last 6 Months",
                    ].map((option) => (
                      <div
                        key={option}
                        className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                          selectedFilter === option
                            ? "bg-gray-50 font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedFilter(option);
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
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border border-gray-400 rounded-tl-[10px] rounded-tr-[10px]">
                <th className="p-2 font-medium">Company Name</th>
                <th className="p-2 font-medium">Email</th>
                <th className="p-2 font-medium">Location</th>
                <th className="p-2 font-medium">Created At</th>
                <th className="p-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployers.map((employer) => (
                <tr key={employer.id} className="border-t border-gray-300">
                  <td className="p-2 font-regular flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    {employer.companyName || "—"}
                  </td>

                  <td className="p-2 font-regular">{employer.email || "—"}</td>
                  <td className="p-2 font-regular">
                    {employer.companyAddress || "—"}
                  </td>
                  <td className="p-2 font-regular">
                    {employer.created_at
                      ? new Date(employer.created_at)
                          .toISOString()
                          .split("T")[0]
                      : "—"}
                  </td>

                  <td className="p-2 text-right relative">
                    <button
                      onClick={() =>
                        setActionOpen(
                          actionOpen === employer.id ? null : employer.id
                        )
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {actionOpen === employer.id && (
                      <div
                        ref={actionMenuRef}
                        className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32 text-sm border border-gray-200 z-10"
                      >
                        {/* Preview */}
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/Admin/components/Employers/${employer.id}`
                            );
                            setActionOpen(null);
                          }}
                        >
                          Preview
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Delete */}
                        <div
                          className="px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={async () => {
                            if (
                              confirm(
                                `Delete employer: ${employer.companyName}?`
                              )
                            ) {
                              try {
                                await fetch(
                                  `https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/employer_profiles/${employer.id}`,
                                  { method: "DELETE" }
                                );
                                setEmployers((prev) =>
                                  prev.filter((e) => e.id !== employer.id)
                                );
                                setActionOpen(null);
                              } catch (err) {
                                console.error(
                                  "Error deleting employer:",
                                  err
                                );
                              }
                            }
                          }}
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

          {filteredEmployers.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No employers found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
