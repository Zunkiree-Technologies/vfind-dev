"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Camera,
  User,
  MapPinned,
  ImageUp,
} from "lucide-react";
import Loader from "../../../../components/loading";
import Footer from "@/app/Admin/components/layout/Footer";
import EmployerNavbar from "../components/EmployerNavbar";
import Image from "next/image";
import MainButton from "@/components/ui/MainButton";
import { getEmployerProfile, updateEmployerProfile, uploadProfileImage } from "@/lib/supabase-api";

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

const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Please select an image file";
  }

  if (file.size > 10 * 1024 * 1024) {
    return "Image size should be less than 10MB";
  }

  return null;
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
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchEmployer = async () => {
      try {
        console.log("🔐 Fetching employer profile...");
        const data = await getEmployerProfile(token);

        if (data) {
          // Map Supabase snake_case to frontend camelCase
          const employerData: Employer = {
            mobile: data.mobile || "",
            companyName: data.company_name || "",
            email: data.email || "",
            Australian_Business_Number: data.australian_business_number || "",
            businessType: data.business_type || "",
            numberOfEmployees: data.number_of_employees || "",
            fullName: data.full_name || "",
            yourDesignation: data.designation || "",
            state: data.state || "",
            city: data.city || "",
            pinCode: data.pin_code || "",
            companyAddress: data.company_address || "",
            password: "",
            Organization_websiteSocial_Media_Link: data.website_link || "",
            creatingAccountAs: data.account_type || "company",
            company_logo: data.company_logo_url ? { url: data.company_logo_url, path: "", name: "", type: "", mime: "", size: 0, access: "" } : undefined,
            country: data.country || "Australia",
          };
          console.log("✅ Employer Data fetched:", employerData);
          setEmployer(employerData);
          setEditedEmployer(employerData);
          setLogoKey(Date.now());
        }
      } catch (err) {
        console.error("❌ Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployer();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFieldChange = (field: keyof Employer, value: string) => {
    setEditedEmployer((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("🖼️ Selected file:", file.name, file.type, file.size);

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      e.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setPendingLogoFile(file);

    e.target.value = "";
  };

  const handleSaveAll = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setUploadingLogo(true);

    try {
      // Upload logo if selected
      let logoUrl = editedEmployer.company_logo?.url;
      if (pendingLogoFile) {
        const uploadResult = await uploadProfileImage(token, pendingLogoFile);
        if (uploadResult.success && uploadResult.url) {
          logoUrl = uploadResult.url;
        } else {
          console.error("Failed to upload logo:", uploadResult.error);
        }
      }

      // Prepare updates object (map camelCase to snake_case)
      const updates = {
        mobile: editedEmployer.mobile,
        company_name: editedEmployer.companyName,
        australian_business_number: editedEmployer.Australian_Business_Number,
        business_type: editedEmployer.businessType,
        number_of_employees: editedEmployer.numberOfEmployees,
        full_name: editedEmployer.fullName,
        designation: editedEmployer.yourDesignation,
        state: editedEmployer.state,
        city: editedEmployer.city,
        pin_code: editedEmployer.pinCode,
        company_address: editedEmployer.companyAddress,
        website_link: editedEmployer.Organization_websiteSocial_Media_Link,
        account_type: editedEmployer.creatingAccountAs,
        country: editedEmployer.country,
        company_logo_url: logoUrl,
      };

      const result = await updateEmployerProfile(token, updates);

      if (!result.success) {
        console.error("API Error:", result.error);
        throw new Error(result.error || "Failed to update profile");
      }

      // Update local state with the new logo URL
      const updatedEmployer = {
        ...editedEmployer,
        company_logo: logoUrl ? { url: logoUrl, path: "", name: "", type: "", mime: "", size: 0, access: "" } : undefined,
      };
      setEmployer(updatedEmployer);
      setEditedEmployer(updatedEmployer);

      // Clear pending logo and preview
      setPendingLogoFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setLogoKey(Date.now());

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Save Error:", err);
    } finally {
      setUploadingLogo(false);
    }
  };


  const handleCancelEdit = () => {
    setEditedEmployer(employer);
    setPendingLogoFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsEditing(false);
  };

  if (loading) return <Loader />;

  const displayData = isEditing ? editedEmployer : employer;
  const displayLogoUrl = previewUrl || displayData.company_logo?.url;

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

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 ">
        {/* Company Logo Section */}
        <div className="p-4 flex flex-col items-center gap-4">
          <div
            className="w-40 h-40 rounded-full border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center"
          >
            {displayLogoUrl ? (
              <Image
                key={`company-logo-${logoKey}`}
                src={displayLogoUrl}
                alt="Company Logo"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
                priority
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-sm">No Photo</span>
              </div>
            )}
          </div>

          {/* New Edit Logo Button */}
          {isEditing && (
            <div className="mt-2">
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 flex items-center gap-2 text-primary border border-primary rounded-md cursor-pointer"
              >
                <ImageUp className="w-4 h-4" />
                Upload / Change Photo
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                disabled={uploadingLogo}
                className="hidden"
              />
            </div>
          )}

          {/* Show selected file name */}
          {isEditing && pendingLogoFile && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {pendingLogoFile.name}
            </p>
          )}
        </div>

        <div className="w-full max-w-3xl space-y-4">
          <div className="flex justify-end gap-3 mb-4">
            {!isEditing ? (
              <MainButton onClick={() => setIsEditing(true)}>
                Edit Profile
              </MainButton>
            ) : (
              <>
                <MainButton onClick={handleCancelEdit}>Cancel</MainButton>
                <MainButton onClick={handleSaveAll} disabled={uploadingLogo}>
                  {uploadingLogo ? "Saving..." : "Save"}
                </MainButton>
              </>
            )}
          </div>

          <div className="space-y-4">
            {/* Company Details Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4">
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
                      value={displayData.companyName}
                      onChange={(e) =>
                        handleFieldChange("companyName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="ABC healthcare"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={displayData.email}
                      disabled
                      placeholder="abc@gmail.com"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={displayData.mobile}
                      onChange={(e) =>
                        handleFieldChange("mobile", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="+61 444444444"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Australian Business Number{" "}

                    </label>
                    <input
                      type="text"
                      value={displayData.Australian_Business_Number}
                      onChange={(e) =>
                        handleFieldChange(
                          "Australian_Business_Number",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      placeholder="04 000000"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={displayData.businessType}
                      onChange={(e) =>
                        handleFieldChange("businessType", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="e.g., Healthcare, Agecare"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Number of Employees
                    </label>

                    {!isEditing ? (
                      <input
                        type="text"
                        value={displayData.numberOfEmployees || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm bg-gray-100 "
                      />
                    ) : (
                      <select
                        value={displayData.numberOfEmployees}
                        onChange={(e) =>
                          handleFieldChange("numberOfEmployees", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                      >
                        <option value="selection"> Number of employee</option>
                        <option value="Less than 5 employees">Less than 5 employees</option>
                        <option value="Less than 20 employees">Less than 20 employees</option>
                        <option value="Less than 50 employees">Less than 50 employees</option>
                        <option value="Less than 100 employees">Less than 100 employees</option>
                        <option value="Less than 200 employees">Less than 200 employees</option>
                        <option value="More than 200 employees">More than 200 employees</option>
                      </select>
                    )}
                  </div>




                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Organization Website / Social Media Link
                    </label>
                    <input
                      type="text"
                      value={displayData.Organization_websiteSocial_Media_Link}
                      onChange={(e) =>
                        handleFieldChange(
                          "Organization_websiteSocial_Media_Link",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      placeholder="https://www.example.com or social media link"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Contact Person Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">
                    Primary Contact Person
                  </h2>
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
                      value={displayData.fullName}
                      onChange={(e) =>
                        handleFieldChange("fullName", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Enter contact name"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={displayData.yourDesignation}
                      onChange={(e) =>
                        handleFieldChange("yourDesignation", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="(e.g: HR Manager, Director)"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <MapPinned className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">
                    Location Information
                  </h2>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Country
                    </label>
                    <input
                      type="text"
                      value={displayData.country || "Australia"}
                      onChange={(e) =>
                        handleFieldChange("country", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>


                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      State
                    </label>

                    {!isEditing ? (
                      <input
                        type="text"
                        value={displayData.state || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm bg-gray-100 "
                      />
                    ) : (
                      <select
                        value={displayData.state}
                        onChange={(e) =>
                          handleFieldChange("state", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm"
                      >
                        <option value="">Select your state</option>
                        <option value="New South Wales">New South Wales</option>
                        <option value="Victoria">Victoria</option>
                        <option value="Queensland">Queensland</option>
                        <option value="South Australia">South Australia</option>
                        <option value="Western Australia">Western Australia</option>
                        <option value="Tasmania">Tasmania</option>
                        <option value="Northern Territory">Northern Territory</option>
                        <option value="Australian Capital Territory">Australian Capital Territory</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      City
                    </label>
                    <input
                      type="text"
                      value={displayData.city}
                      onChange={(e) => handleFieldChange("city", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Sydney"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Post Code
                    </label>
                    <input
                      type="text"
                      value={displayData.pinCode}
                      onChange={(e) =>
                        handleFieldChange("pinCode", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="0000"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-sm font-medium block mb-1 text-gray-500">
                      Company Address
                    </label>
                    <input
                      type="text"
                      value={displayData.companyAddress}
                      onChange={(e) =>
                        handleFieldChange("companyAddress", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Enter your company address..."
                      className="w-fit px-3 py-2 border border-gray-400 rounded-md text-sm disabled:bg-gray-100 "
                    />

                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}