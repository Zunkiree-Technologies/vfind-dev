"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  Briefcase,
  Globe,
  Hash,
  ArrowLeft,
} from "lucide-react";
import Loader from "../../../../../components/loading";

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
}

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-white shadow-md">
    <Icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base text-gray-900 font-medium break-words">{value || "-"}</p>
    </div>
  </div>
);

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
    <div className="min-h-screen bg-white text-gray-900 p-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4">
          <Building2 className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold mb-1">{employer.companyName}</h1>
        <p className="text-xl text-blue-600">{employer.fullName}</p>
        <div className="mt-2">
          <Badge className="bg-blue-600 text-white">
            {employer.creatingAccountAs === "company" ? "Company Account" : "Individual Account"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <h2 className="text-2xl font-bold">Personal Information</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={Briefcase} label="Full Name" value={employer.fullName} />
              <InfoCard icon={Mail} label="Email" value={employer.email} />
              <InfoCard icon={Phone} label="Mobile" value={employer.mobile} />
              <InfoCard icon={Briefcase} label="Designation" value={employer.yourDesignation} />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <h2 className="text-2xl font-bold">Location Information</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={Globe} label="Country" value={employer.country} />
              <InfoCard icon={MapPin} label="City" value={employer.city} />
              <InfoCard icon={Hash} label="Pin Code" value={employer.pinCode.toString()} />
              <InfoCard icon={MapPin} label="Company Address" value={employer.companyAddress} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <h2 className="text-2xl font-bold">Company Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoCard icon={Building2} label="Company Name" value={employer.companyName} />
              <InfoCard icon={Users} label="Number of Employees" value={employer.numberOfEmployees} />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-blue-50">
            <CardHeader>
              <h3 className="text-lg font-semibold">Account Summary</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Account Type</span>
                <Badge className="bg-blue-600 text-white">{employer.creatingAccountAs === "company" ? "Company" : "Individual"}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Status</span>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Location</span>
                <span className="text-sm font-medium">{employer.city}, {employer.country}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
