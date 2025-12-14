export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { Navbar } from "./components/Navbar";
import Jobdata from "./components/Jobdata";
import Footer from "../Admin/components/layout/Footer";
import ProfileCompletionWidget from "../../../components/ProfileCompletionWidget";

export default function NurseDashboard() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Job Listings */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading jobs...</div>}>
              <Jobdata />
            </Suspense>
          </div>
          {/* Sidebar - Profile Completion Widget */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-24">
              <ProfileCompletionWidget />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer/>
      </div>
    </>
  );
}
