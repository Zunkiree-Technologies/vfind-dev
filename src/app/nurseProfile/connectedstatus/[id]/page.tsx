"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, MapPinned, User, ArrowLeft } from "lucide-react";
import Loader from "../../../../../components/loading";
import { Navbar } from "../../components/Navbar";
import Footer from "@/app/Admin/components/layout/Footer";


interface Employer {
  id: number;
  mobile: string;
  creatingAccountAs: string;
  fullName: string;
  email: string;
  companyName: string;
  numberOfEmployees: string;
  yourDesignation: string;
  country: string;
  city: string;
  pinCode: string;
  companyAddress: string;
  AustralianBusinessNumber?: string;
  businessType?: string;
  organizationWebsite?: string;
  state?: string;
}

export default function EmployerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !id) {
      setLoading(false);
      return;
    }

    const fetchEmployer = async () => {
      try {
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:LP_rdOtV/getNurseNotifications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch employer data");
        const data = await res.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const connection = data.find((item: any) => item._employer_profiles?.id === Number(id));
        if (connection?._employer_profiles) setEmployer(connection._employer_profiles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployer();
  }, [id]);

  if (loading) return <Loader />;
  if (!employer)
    return <div className="text-center mt-10 text-gray-500">Employer not found</div>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="w-full max-w-3xl mx-auto mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          {/* Company Logo and Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4">
              <Building2 className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold">{employer.companyName}</h1>
            <p className="text-gray-600 text-sm mt-1">Employer Profile</p>
          </div>

          <div className="space-y-4">
            {/* Company Details Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">Company Details</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={employer.companyName || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={employer.email || "-"}
                      readOnly
                      className="w-full  py-2  rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={employer.mobile || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Australian Business Number
                    </label>
                    <input
                      type="text"
                      value={employer.AustralianBusinessNumber || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={employer.businessType || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Number of Employees
                    </label>
                    <input
                      type="text"
                      value={employer.numberOfEmployees || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Organization Website / Social Media Link
                    </label>
                    <input
                      type="text"
                      value={employer.organizationWebsite || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Contact Person Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 cursor-pointer">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">Primary Contact Person</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={employer.fullName || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={employer.yourDesignation || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 cursor-pointer">
                <div className="flex items-center gap-2">
                  <MapPinned className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">Location Information</h2>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      State
                    </label>
                    <input
                      type="text"
                      value={employer.state || employer.country || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      City
                    </label>
                    <input
                      type="text"
                      value={employer.city || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Post Code
                    </label>
                    <input
                      type="text"
                      value={employer.pinCode || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Company Address
                    </label>
                    <input
                      type="text"
                      value={employer.companyAddress || "-"}
                      readOnly
                      className="w-full  py-2   rounded-md text-sm bg-white cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
      <div>
              <Footer />
            </div>
    </div>

  );
}