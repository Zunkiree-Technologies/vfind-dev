// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Get token from cookies
  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  // Protect EmployerDashboard routes
  if (pathname.startsWith("/EmployerDashboard")) {
    if (!token) {
      // Redirect to employer login if not logged in
      url.pathname = "/employerloginpage"; // or your employer login route
      return NextResponse.redirect(url);
    }
  }

  // Protect nurseProfile routes
  if (pathname.startsWith("/nurseProfile")) {
    if (!token) {
      // Redirect to nurse login if not logged in
      url.pathname = "/signin"; // or your nurse login route
      return NextResponse.redirect(url);
    }
  }

  // If token exists or route is public, continue
  return NextResponse.next();
}

// Apply middleware only to these paths
export const config = {
  matcher: [
    "/EmployerDashboard/:path*", 
    "/nurseProfile/:path*"
  ],
};
