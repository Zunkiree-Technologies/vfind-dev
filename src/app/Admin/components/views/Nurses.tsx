"use client";

import { useEffect, useState, useRef } from "react";
import { MoreVertical, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteModal from "./deleteModal";
import { supabase } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

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
    async function fetchNurses() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('nurses')
          .select('id, full_name, email, qualification, created_at')
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        // Map to Nurse interface
        const mappedNurses: Nurse[] = (data || []).map((n) => ({
          id: Number(n.id),
          fullName: n.full_name,
          email: n.email,
          qualification: n.qualification,
          startDate: n.created_at,
        }));

        setNurses(mappedNurses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch nurses"
        );
        setNurses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNurses();
  }, []);

  const applyDateFilter = (nurse: Nurse) => {
    if (selectedFilter === "All Time") return true;
    if (!nurse.startDate) return selectedFilter === "All Time";

    try {
      const created = new Date(nurse.startDate);
      if (isNaN(created.getTime())) return selectedFilter === "All Time";

      const now = new Date();

      switch (selectedFilter) {
        case "Last 24 Hours":
          return created >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case "Last 7 Days":
          return created >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case "Last 30 Days":
          return created >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case "Last 6 Months":
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return created >= sixMonthsAgo;
        default:
          return true;
      }
    } catch {
      return selectedFilter === "All Time";
    }
  };

  const filteredNurses = nurses
    .filter((nurse) =>
      (nurse?.fullName || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter(applyDateFilter);

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-6 mx-4 my-4">Nurses Overview</h1>
        <div className="px-5">
          <div className="bg-white shadow rounded-lg p-4 mx-auto container">
            <div className="text-center py-8">
              <p>Loading nurses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-6 mx-4 my-4">Nurses Overview</h1>
        <div className="px-5">
          <div className="bg-white shadow rounded-lg p-4 mx-auto container">
            <div className="text-center py-8 text-red-600">
              <p>Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6 mx-4 my-4">Nurses Overview</h1>
      <div className="px-5">
        <div className="bg-white shadow rounded-lg p-4 mx-auto container">
          {/* Header: Search + Filter */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[18px] font-bold text-gray-800 mb-1">
                Registered Nurses
              </h2>
            </div>

            <div className="flex item-center justify-around gap-4">
              {/* Search */}
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

              {/* Filter */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 text-sm"
                >
                  <Filter className="w-4 h-4" /> {selectedFilter}
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow rounded w-40 text-sm z-20">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border border-gray-400 rounded-tl-[10px] rounded-tr-[10px]">
                  <th className="p-2 font-medium">Nurse</th>
                  <th className="p-2 font-medium">Email</th>
                  <th className="p-2 font-medium">Role</th>
                  <th className="p-2 font-medium">Created At</th>
                  <th className="p-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredNurses.map((nurse) => (
                  <tr key={nurse.id} className="border-t border-gray-300">
                    <td className="p-2 font-regular">
                      {nurse.fullName || "—"}
                    </td>
                    <td className="p-2 font-regular">{nurse.email || "—"}</td>
                    <td className="p-2 font-regular">
                      {nurse.qualification || "—"}
                    </td>
                    <td className="p-2 font-regular">
                      {nurse.startDate
                        ? (() => {
                            try {
                              return new Date(nurse.startDate)
                                .toISOString()
                                .split("T")[0];
                            } catch {
                              return "Invalid Date";
                            }
                          })()
                        : "—"}
                    </td>

                    <td className="p-2 text-right relative">
                      <button
                        onClick={() =>
                          setActionOpen(
                            actionOpen === nurse.id ? null : nurse.id
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>

                      {actionOpen === nurse.id && (
                        <div
                          ref={actionMenuRef}
                          className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32 text-sm border border-gray-200 z-10"
                        >
                          {/* Preview */}
                          <div
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              router.push(
                                `/Admin/components/Nurses/${nurse.id}`
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
                            onClick={() => {
                              setSelectedNurse(nurse);
                              setDeleteModalOpen(true);
                              setActionOpen(null); // close dropdown
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
          </div>

          {filteredNurses.length === 0 && nurses.length > 0 && (
            <p className="text-center text-gray-500 py-6">
              No nurses found matching current filters
            </p>
          )}

          {nurses.length === 0 && (
            <p className="text-center text-gray-500 py-6">No nurses found</p>
          )}
        </div>
      </div>
      <DeleteModal
        open={deleteModalOpen}
        nurseName={selectedNurse?.fullName}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          if (!selectedNurse) return;
          try {
            const { error } = await supabase
              .from('nurses')
              .delete()
              .eq('id', selectedNurse.id);

            if (error) throw new Error(error.message);

            setNurses((prev) => prev.filter((n) => n.id !== selectedNurse.id));
          } catch (err) {
            console.error("Error deleting nurse:", err);
          } finally {
            setDeleteModalOpen(false);
            setSelectedNurse(null);
          }
        }}
      />
    </div>
  );
}
