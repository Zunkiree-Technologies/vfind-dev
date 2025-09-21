"use client";

import React, { useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Briefcase,
  ArrowLeft,
  User,
  User2,
} from "lucide-react";
import Loader from "../../../../../../components/loading";
import { Badge } from "@/components/ui/Badge";

interface Employer {
  id?: number;
  mobile?: string;
  creatingAccountAs?: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  numberOfEmployees?: string;
  yourDesignation?: string;
  country?: string;
  city?: string;
  pinCode?: string;
  companyAddress?: string;
  created_at?: string;
}

export default function EmployerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const res = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/employer_profiles/${id}`,
          { cache: "no-store" }
        );
        if (!res.ok) return notFound();
        const data = await res.json();
        setEmployer(data);
      } catch (err) {
        console.error("Failed to load employer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployer();
  }, [id]);

  if (loading) return <Loader />;
  if (!employer) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="px-6 py-4  ">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/Admin/components/Employers");
            }
          }}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-[1182px] mx-auto px-6 py-6 container">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                {employer.companyName || "Company Name"}
              </h1>

              <div className="flex items-center gap-3 mb-2">
                <User2 width={15} height={15} className="text-gray-600" />
                <p className="text-gray-600">{employer.fullName || "Employer Name"}</p>
              </div>

              <Badge className="bg-blue-50 text-blue-400 border-blue-200 text-xs px-2 py-1">
                {employer.creatingAccountAs === "company"
                  ? "Company Account"
                  : "Individual Account"}
              </Badge>
            </div>

          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" />
                <h2 className="text-base font-medium text-gray-900">
                  Personal Information
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-5">
                <div className="text-sm">
                  <span className="text-gray-500">Full Name</span>
                  <p className="text-gray-900 font-medium">{employer.fullName || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Email</span>
                  <p className="text-gray-900 font-medium">{employer.email || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Mobile Number</span>
                  <p className="text-gray-900 font-medium">{employer.mobile || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Designation</span>
                  <p className="text-gray-900 font-medium">{employer.yourDesignation || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Company Details */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-400" />
                <h2 className="text-base font-medium text-gray-900">Company Details</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Company Name</span>
                  <p className="text-gray-900 font-medium">{employer.companyName || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Number of Employees</span>
                  <p className="text-gray-900 font-medium">{employer.numberOfEmployees || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Created At</span>
                  <p className="text-gray-900 font-medium">
                    {employer.created_at
                      ? new Date(employer.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                      : "—"
                    }
                  </p>
                </div>
              </div>
            </CardContent>

          </Card>

          {/* Location Information */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-400" />
                <h2 className="text-base font-medium text-gray-900">Location Information</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Country</span>
                  <p className="text-gray-900 font-medium">{employer.country || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">City</span>
                  <p className="text-gray-900 font-medium">{employer.city || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Pin Code</span>
                  <p className="text-gray-900 font-medium">{employer.pinCode || "—"}</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Company Address</span>
                  <p className="text-gray-900 font-medium">{employer.companyAddress || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Summary */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-400" />
                <h2 className="text-base font-medium text-gray-900">Account Summary</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-5">
                <div className="text-sm flex flex-col">
                  <span className="text-gray-500">Account Type</span>
                  <Badge className="bg-blue-50 text-blue-400 border-blue-200 text-xs px-2 py-1 w-fit">
                    {employer.creatingAccountAs || "—"}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Profile Status</span>
                  <div className="mt-1">
                    <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Location</span>
                  <p className="text-gray-900 font-medium">
                    {employer.city && employer.country
                      ? `${employer.city}, ${employer.country}`
                      : employer.city || employer.country || "—"
                    }
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}