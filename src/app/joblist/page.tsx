export const dynamic = "force-dynamic";


import React, { Suspense } from "react";
import Jobdata from "../nurseProfile/components/Jobdata";
import { Navbar } from "../nurseProfile/components/Navbar";

export default function JobListPage() {
  return (
    <>
      <Navbar />
      {/* Wrap Jobdata in Suspense since it uses useSearchParams */}
      <Suspense fallback={<div>Loading jobs...</div>}>
        <Jobdata />
      </Suspense>
    </>
  );
}
