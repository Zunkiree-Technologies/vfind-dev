"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 

export default function OAuthCallback() {
  const [status, setStatus] = useState("Processing...");
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        // Check for OAuth errors from Google
        if (error) {
          console.error("OAuth error from Google:", error);
          setStatus("Login cancelled or failed");
          setTimeout(() => router.push("/signin"), 2000);
          return;
        }

        if (!code) {
          console.error("No authorization code received");
          setStatus("No authorization code received");
          setTimeout(() => router.push("/signin"), 2000);
          return;
        }

        console.log("Authorization code received:", code);
        setStatus("Exchanging code for token...");

        // Same redirect_uri as used in signinWithGoogle
        const redirectUri = process.env.NEXT_PUBLIC_APP_URL + "/oauth/callback";

        // Call Xano's continue endpoint (GET request with query params)
        const params = new URLSearchParams({
          code: code,
          redirect_uri: redirectUri, // Must match exactly what was sent to /init
        });

        const response = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:U0aE1wpF/oauth/google/continue?${params.toString()}`
        );

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        const data = await response.json();
        console.log("OAuth continue response:", data);

        if (!response.ok) {
          console.error("OAuth continue failed:", data);

          // Handle specific error for users who haven't signed up yet
          if (
            data.error === "account_not_found" ||
            data.code === "ERROR_CODE_ACCESS_DENIED"
          ) {
            setStatus(
              "No account found with this email. Please sign up first."
            );
            setTimeout(
              () => router.push("/signup?message=create-account-first"),
              3000
            );
            return;
          }

          // Handle other OAuth errors
          setStatus(
            `Google sign-in failed: ${
              data.message || data.payload || "Please try again"
            }`
          );
          setTimeout(
            () => router.push("/signin?error=google-signin-failed"),
            3000
          );
          return;
        }

        // Check if we got a token (Xano returns 'token' not 'authToken')
        if (data.token) {
          console.log("Auth token received, logging in...");
          console.log("User info:", { name: data.name, email: data.email });
          setStatus("Login successful! Redirecting...");

          // Store the token and user info (consistent with regular signin)
          localStorage.setItem("token", data.token); // Changed from 'authToken'
          localStorage.setItem("email", data.email);
          localStorage.setItem("userName", data.name);

          // Redirect to same place as regular signin
          setTimeout(() => router.push("/nurseProfile"), 1000);
        } else {
          // This should rarely happen now, but keep as fallback
          console.error("Unexpected response format:", data);
          setStatus(
            data.payload
          );
          setTimeout(
            () => router.push("/signin?error=unexpected-response"),
            3000
          );
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("Login failed due to network error");
        setTimeout(() => router.push("/signin"), 3000);
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      handleOAuthCallback();
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Sign-In
        </h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}