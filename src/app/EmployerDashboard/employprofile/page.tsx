"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Edit,
  Check,
  X,
} from "lucide-react";
import Loader from "../../../../components/loading";

interface Employer {
  id?: number;
  mobile: string;
  creatingAccountAs: string;
  fullName: string;
  email: string;
  password?: string;
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
  field: keyof Employer;
  onSave: (field: keyof Employer, value: string) => void;
  disableEdit?: boolean;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  field,
  onSave,
  disableEdit = false,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(field, tempValue);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg bg-white shadow-md ${className}`}
    >
      <Icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>

        {!isEditing ? (
          <div className="flex items-center justify-between">
            <p className="text-base text-gray-900 font-medium break-words">
              {value || "-"}
            </p>
            {!disableEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 ml-2"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="border rounded px-2 py-1 text-sm flex-1"
            />
            <button
              onClick={handleSave}
              className="text-green-600 font-medium"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setTempValue(value);
                setIsEditing(false);
              }}
              className="text-red-500 font-medium"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EmployerProfile() {
  const router = useRouter();
  const [employer, setEmployer] = useState<Employer>({
    mobile: "",
    creatingAccountAs: "company",
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    numberOfEmployees: "",
    yourDesignation: "",
    country: "Australia",
    city: "",
    pinCode: "",
    companyAddress: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchEmployer = async () => {
      try {
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/get_employer_profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch employer profile");
        const data = await res.json();
        setEmployer(data?.data || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployer();
  }, []);

  const handleFieldSave = async (field: keyof Employer, newValue: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const updatedData = { ...employer, [field]: newValue };

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/edit_employer_profile",
        {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();

      setEmployer(updated?.data || updated);
    } catch (err) {
      console.error(err);
      alert("Failed to update field");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/EmployerDashboard");
            }
          }}
          className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      {/* Header Section */}
      <div className="py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Building2 className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {employer.companyName || "Company Profile"}
          </h1>
          <p className="text-xl text-blue-600">
            {employer.fullName || "Employer Profile"}
          </p>
          <div className="mt-4 flex justify-center">
            <Badge className="bg-blue-600 text-white border-blue-500">
              {employer.creatingAccountAs === "company"
                ? "Company Account"
                : "Individual Account"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <h2 className="text-2xl font-bold">Personal Information</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon={Briefcase}
                    label="Full Name"
                    value={employer.fullName}
                    field="fullName"
                    onSave={handleFieldSave}
                  />
                  <InfoCard
                    icon={Mail}
                    label="Email Address"
                    value={employer.email}
                    field="email"
                    onSave={handleFieldSave}
                    disableEdit 
                  />
                  <InfoCard
                    icon={Phone}
                    label="Mobile Number"
                    value={employer.mobile}
                    field="mobile"
                    onSave={handleFieldSave}
                  />
                  <InfoCard
                    icon={Briefcase}
                    label="Your Designation"
                    value={employer.yourDesignation}
                    field="yourDesignation"
                    onSave={handleFieldSave}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <h2 className="text-2xl font-bold">Location Information</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon={Globe}
                    label="Country"
                    value={employer.country}
                    field="country"
                    onSave={handleFieldSave}
                  />
                  <InfoCard
                    icon={MapPin}
                    label="City"
                    value={employer.city}
                    field="city"
                    onSave={handleFieldSave}
                  />
                  <InfoCard
                    icon={Hash}
                    label="Pin Code"
                    value={employer.pinCode}
                    field="pinCode"
                    onSave={handleFieldSave}
                  />
                  <div className="md:col-span-2">
                    <InfoCard
                      icon={MapPin}
                      label="Company Address"
                      value={employer.companyAddress}
                      field="companyAddress"
                      onSave={handleFieldSave}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Company Info */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <h2 className="text-2xl font-bold">Company Details</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoCard
                    icon={Building2}
                    label="Company Name"
                    value={employer.companyName}
                    field="companyName"
                    onSave={handleFieldSave}
                  />
                  <InfoCard
                    icon={Users}
                    label="Number of Employees"
                    value={employer.numberOfEmployees}
                    field="numberOfEmployees"
                    onSave={handleFieldSave}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Summary Card */}
            <Card className="shadow-lg border-0 bg-blue-50">
              <CardHeader>
                <h3 className="text-lg font-semibold">Account Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Account Type</span>
                    <Badge className="bg-blue-600 text-white">
                      {employer.creatingAccountAs === "company"
                        ? "Company"
                        : "Individual"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profile Status</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-medium">
                      {employer.city}, {employer.country}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
