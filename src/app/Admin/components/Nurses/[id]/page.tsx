"use client";

import React, { useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, Mail, Phone, ArrowLeft } from "lucide-react";
import Loader from "../../../../../../components/loading";

export default function NurseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);  // ✅ match EmployerPage
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nurse, setNurse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNurse() {
      try {
        const res = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:t5TlTxto/nurse_profiles_admin/${id}`,
          { cache: "no-store" }
        );
        if (!res.ok) return notFound();
        const data = await res.json();
        setNurse(data);
      } catch (err) {
        console.error("Failed to load nurse:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNurse();
  }, [id]);

  if (loading) return <Loader />;
  if (!nurse) return notFound();

  // ✅ Parse jobTypes
  let jobTypes: string[] = [];
  try {
    if (nurse.jobTypes) jobTypes = JSON.parse(nurse.jobTypes);
  } catch {}

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <button onClick={() => router.back()} className="text-blue-600 flex items-center">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
      </div>

      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">{nurse.fullName || "Nurse Profile"}</h1>
          </CardHeader>
          <CardContent>
            <p><Mail className="inline w-4 h-4" /> {nurse.email}</p>
            <p><Phone className="inline w-4 h-4" /> {nurse.phoneNumber}</p>
            <p><Briefcase className="inline w-4 h-4" /> {jobTypes.join(", ")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
