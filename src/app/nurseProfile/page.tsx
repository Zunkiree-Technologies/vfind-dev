export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import { Navbar } from "./components/Navbar";
import Jobdata from "./components/Jobdata";
import Footer from "../Admin/components/layout/Footer";

export default function NurseDashboard() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading jobs...</div>}>
        <Jobdata />
      </Suspense>
      <div>
        <Footer/>
      </div>
    </>
  );
}
