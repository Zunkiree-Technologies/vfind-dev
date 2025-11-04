// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // Get authentication data from cookies
  const authToken = req.cookies.get("authToken")?.value;
  const userRole = req.cookies.get("userRole")?.value;
  const userEmail = req.cookies.get("userEmail")?.value;

  // Define route protection rules
  const protectedRoutes = {
    employer: ["/EmployerDashboard", "/Applicants"],
    nurse: ["/nurseProfile", "/joblist"],
  };

  // Check if current path matches any employer routes
  const isEmployerRoute = protectedRoutes.employer.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path matches any nurse routes
  const isNurseRoute = protectedRoutes.nurse.some((route) =>
    pathname.startsWith(route)
  );

  // Protect Employer routes
  if (isEmployerRoute) {
    if (!authToken) {
      // No token - redirect to employer login
      url.pathname = "/employerloginpage";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (userRole !== "Employer") {
      // Wrong role - redirect to their appropriate dashboard
      url.pathname = userRole === "Nurse" ? "/nurseProfile" : "/employerloginpage";
      return NextResponse.redirect(url);
    }
  }

  // Protect Nurse routes
  if (isNurseRoute) {
    if (!authToken) {
      // No token - redirect to nurse login
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (userRole !== "Nurse") {
      // Wrong role - redirect to their appropriate dashboard
      url.pathname = userRole === "Employer" ? "/EmployerDashboard" : "/signin";
      return NextResponse.redirect(url);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Apply middleware to protected routes only
export const config = {
  matcher: [
    // Employer routes
    "/EmployerDashboard/:path*",
    "/Applicants/:path*",

    // Nurse routes
    "/nurseProfile/:path*",
    "/joblist/:path*",

    // Exclude static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
