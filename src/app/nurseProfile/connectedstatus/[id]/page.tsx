"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Users,
  Link,
  File,
  MapPin,
  Hash,
  MapPinCheck,
  Globe,
  User,
  MapPinned,
} from "lucide-react";
import Loader from "../../../../../components/loading";
import { Navbar } from "../../components/Navbar";
import Footer from "@/app/Admin/components/layout/Footer";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getEmployerById } from "@/lib/supabase-api";

interface CompanyLogo {
  url: string;
  path: string;
  name: string;
  type: string;
  mime: string;
  size: number;
  access: string;
  meta?: {
    width: number;
    height: number;
  };
}

interface Employer {
  mobile: string;
  companyName: string;
  email: string;
  Australian_Business_Number: string;
  businessType: string;
  numberOfEmployees: string;
  fullName: string;
  yourDesignation: string;
  state: string;
  city: string;
  pinCode: string;
  companyAddress: string;
  password: string;
  Organization_websiteSocial_Media_Link: string;
  creatingAccountAs: string;
  country?: string;
  company_logo?: CompanyLogo;
}

export default function EmployerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoKey, setLogoKey] = useState(Date.now());

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEmployer = async () => {
      try {
        const employerData = await getEmployerById(String(id));

        if (!employerData) throw new Error("Employer not found");

        // Map Supabase data to Employer interface
        const mapped: Employer = {
          mobile: employerData.mobile || "",
          companyName: employerData.company_name || "",
          email: employerData.email || "",
          Australian_Business_Number: employerData.australian_business_number || "",
          businessType: employerData.business_type || "",
          numberOfEmployees: employerData.number_of_employees || "",
          fullName: employerData.full_name || "",
          yourDesignation: employerData.designation || "",
          state: employerData.state || "",
          city: employerData.city || "",
          pinCode: employerData.pin_code || "",
          companyAddress: employerData.company_address || "",
          password: "",
          Organization_websiteSocial_Media_Link: employerData.website_link || "",
          creatingAccountAs: employerData.account_type || "",
          country: employerData.country,
          company_logo: employerData.company_logo_url ? {
            url: employerData.company_logo_url,
            path: "",
            name: "",
            type: "",
            mime: "",
            size: 0,
            access: "",
          } : undefined,
        };

        setEmployer(mapped);
        setLogoKey(Date.now());
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-blue-400 font-medium hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      {/* Company Header */}
      <div className="py-8">
        <div className="container mx-auto px-6 text-center">
          {/* Company Logo */}
          <div className="relative inline-block mb-4">
            {employer.company_logo?.url ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 bg-gray-100">
                <Image
                  key={`company-logo-${logoKey}`}
                  src={`${employer.company_logo.url}?v=${logoKey}`}
                  alt="Company Logo"
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-400">
                <Building2 className="h-16 w-16 text-blue-400" />
              </div>
            )}
          </div>

          {/* Company Info */}
          <h1 className="text-4xl font-bold mb-2">
            {employer.companyName || "Company Profile"}
          </h1>

          <div className="mt-4 flex justify-center">
            <div className="bg-blue-400 text-white rounded-lg px-3">
              {employer.businessType || "Aged Care"}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="container mx-auto mt-5  ">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Company Details */}
            <Card className="border-0 bg-white">
              <CardHeader>
                <h2 className="text-lg font-semibold">Company Details</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailRow
                    icon={Building2}
                    label="Company Name"
                    value={employer.companyName}
                  />
                  <DetailRow icon={Mail} label="Email" value={employer.email} />
                  <DetailRow
                    icon={Phone}
                    label="Company Phone Number"
                    value={employer.mobile}
                  />
                  <DetailRow
                    icon={File}
                    label="Australian Business Number"
                    value={employer.Australian_Business_Number}
                  />
                  <DetailRow
                    icon={Users}
                    label="Number of Employees"
                    value={employer.numberOfEmployees}
                  />
                  <DetailRow
                    icon={Link}
                    label="Social Links"
                    value={employer.Organization_websiteSocial_Media_Link}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Primary Contact */}
            <Card className="border-0 bg-white">
              <CardHeader>
                <h2 className="text-lg font-semibold">Primary Contact Person</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailRow
                    icon={User}
                    label="Contact Name"
                    value={employer.fullName}
                  />
                  <DetailRow
                    icon={MapPinned}
                    label="Designation"
                    value={employer.yourDesignation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card className="border-0 bg-white">
              <CardHeader>
                <h2 className="text-lg font-semibold">Location Information</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailRow
                    icon={Globe}
                    label="Country / State"
                    value={employer.state || employer.country || "-"}
                  />
                  <DetailRow icon={MapPin} label="City" value={employer.city} />
                  <DetailRow
                    icon={Hash}
                    label="Postal Code"
                    value={employer.pinCode}
                  />
                  <div className="md:col-span-2">
                    <DetailRow
                      icon={MapPinCheck}
                      label="Company Address"
                      value={employer.companyAddress}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-white">
          <Footer />
        </div>
      </div>
    </div>
  );
}

/* ✅ Reusable Detail Row (same style as InfoCard but read-only) */
interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-white">
    <Icon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base text-gray-900 font-medium break-words">
        {value || "-"}
      </p>
    </div>
  </div>
);
