"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  Globe,
  Hash,
  ArrowLeft,
  Camera,
  MapPinCheck,
  Link,
  File,
} from "lucide-react";
import Loader from "../../../../components/loading";
import Footer from "@/app/Admin/components/layout/Footer";
import EmployerNavbar from "../components/EmployerNavbar";
import Image from "next/image";
import MainButton from "@/components/ui/MainButton";

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
  company_logo?: CompanyLogo;
  country?: string;
}

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  field: keyof Employer;
  isEditing: boolean;
  onChange: (field: keyof Employer, value: string) => void;
  disableEdit?: boolean;
  className?: string;
}

// Validate image file
const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Please select an image file";
  }

  if (file.size > 10 * 1024 * 1024) {
    return "Image size should be less than 10MB";
  }

  return null;
};

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  field,
  isEditing,
  onChange,
  disableEdit = false,
  className = "",
}) => {
  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg bg-white ${className}`}
    >
      <Icon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>

        {!isEditing || disableEdit ? (
          <p className="text-base text-gray-900 font-medium break-words">
            {value || "-"}
          </p>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full mt-1"
          />
        )}
      </div>
    </div>
  );
};

export default function EmployerProfile() {
  const router = useRouter();
  const [employer, setEmployer] = useState<Employer>({
    mobile: "",
    companyName: "",
    email: "",
    Australian_Business_Number: "",
    businessType: "",
    numberOfEmployees: "",
    fullName: "",
    yourDesignation: "",
    state: "",
    city: "",
    pinCode: "",
    companyAddress: "",
    password: "",
    Organization_websiteSocial_Media_Link: "",
    creatingAccountAs: "company",
    company_logo: undefined,
    country: "Australia",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployer, setEditedEmployer] = useState<Employer>(employer);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoKey, setLogoKey] = useState(Date.now());

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchEmployer = async () => {
      try {
        console.log("🔐 Fetching employer profile...");
        const res = await fetch(
          "https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/get_employer_profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch employer profile");
        const data = await res.json();
        const employerData = data?.data || data;
        console.log("✅ Employer Data fetched:", employerData);
        setEmployer(employerData);
        setEditedEmployer(employerData);
        setLogoKey(Date.now());
      } catch (err) {
        console.error("❌ Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployer();
  }, []);

  const handleFieldChange = (field: keyof Employer, value: string) => {
    setEditedEmployer((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("🖼️ Selected file:", file.name, file.type, file.size);

    // Validate the file
    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }

    setUploadingLogo(true);

    try {
      console.log("📤 Uploading logo...");

      // Create FormData with the image and all employer data
      const formData = new FormData();
      formData.append("company_logo", file);

      // Add all other employer data to FormData (similar to nurse profile)
      Object.entries(employer).forEach(([key, value]) => {
        if (key !== "company_logo" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      console.log("📋 FormData prepared with file and profile data");

      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/edit_employer_profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Upload failed:", errorText);
        throw new Error(`Failed to upload logo: ${res.status}`);
      }

      const updated = await res.json();
      console.log("✅ Upload response:", updated);

      const updatedData = updated?.data || updated;

      // Update both states
      setEmployer(updatedData);
      setEditedEmployer(updatedData);

      // Force image re-render with delay
      setTimeout(() => {
        setLogoKey(Date.now());
        console.log("🔄 Image cache refreshed");
      }, 100);

      console.log("✅ Logo updated successfully:", updatedData.company_logo);
      alert("Company logo updated successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Logo Upload Error:", err);
      alert(err.message || "Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
      // Reset the file input
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleSaveAll = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(
        "https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/edit_employer_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedEmployer),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();

      setEmployer(updated?.data || updated);
      setEditedEmployer(updated?.data || updated);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setEditedEmployer(employer);
    setIsEditing(false);
  };

  if (loading) return <Loader />;

  const displayData = isEditing ? editedEmployer : employer;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <EmployerNavbar />

      <div className="p-6">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/EmployerDashboard");
            }
          }}
          className="inline-flex items-center gap-2 text-blue-400 font-medium hover:underline"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="relative inline-block mb-4">
            {displayData.company_logo?.url ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 bg-gray-100">
                <Image
                  key={`company-logo-${logoKey}`}
                  src={`${displayData.company_logo.url}?v=${logoKey}`}
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

            <label
              title={uploadingLogo ? "Uploading..." : "Change company logo"}
              className={`absolute bottom-0 right-0 bg-blue-400 rounded-full p-2 cursor-pointer transition-all  ${uploadingLogo
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 hover:scale-110"
                }`}
            >
              {uploadingLogo ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="hidden"
              />
            </label>
          </div>

          <h1 className="text-4xl font-bold mb-2">
            {displayData.companyName || "Company Profile"}
          </h1>

          <div className="mt-4 flex justify-center">
            <div className="bg-blue-400 text-white rounded-lg  px-3 ">
              {displayData.businessType || "Age Care"}

            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 -mt-5 pb-12">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-end gap-3">
              {!isEditing ? (
                <MainButton
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </MainButton>
              ) : (
                <>
                  <MainButton
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </MainButton>
                  <MainButton
                    onClick={handleSaveAll}
                  >
                    Save
                  </MainButton>
                </>
              )}
            </div>

            <Card className=" border-0 bg-white">
              <CardHeader>
                <h2 className="text-lg font-semibold">Company Details</h2>

              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon={Building2}
                    label="Company Name"
                    value={displayData.companyName}
                    field="companyName"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />
                  <InfoCard
                    icon={Mail}
                    label="Email Address"
                    value={displayData.email}
                    field="email"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                    disableEdit
                  />

                  <InfoCard
                    icon={File}
                    label="Austalian Business Number"
                    value={displayData.Australian_Business_Number}
                    field="Australian_Business_Number"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />
                  <InfoCard
                    icon={Link}
                    label="Social Links"
                    value={displayData.Organization_websiteSocial_Media_Link}
                    field="Organization_websiteSocial_Media_Link"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />

                  <InfoCard
                    icon={Users}
                    label="Number of Employees"
                    value={displayData.numberOfEmployees}
                    field="numberOfEmployees"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />
                  <InfoCard
                    icon={Phone}
                    label="Company Phone Number"
                    value={displayData.mobile}
                    field="mobile"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className=" border-0 bg-white">
              <CardHeader>

                <h2 className="text-lg font-semibold">Location Information</h2>

              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon={Globe}
                    label="Country"
                    value={displayData.country || ""}
                    field="country"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />
                  <InfoCard
                    icon={MapPin}
                    label="City"
                    value={displayData.city}
                    field="city"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />
                  <InfoCard
                    icon={Hash}
                    label="Postal Code"
                    value={displayData.pinCode}
                    field="pinCode"
                    isEditing={isEditing}
                    onChange={handleFieldChange}
                  />
                  <div className="md:col-span-2">
                    <InfoCard
                      icon={MapPinCheck}
                      label="Company Address"
                      value={displayData.companyAddress}
                      field="companyAddress"
                      isEditing={isEditing}
                      onChange={handleFieldChange}
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