// app/oauth/callback/page.tsx (App Router)
// OR pages/oauth/callback.tsx (Pages Router)

"use client"; // Only needed for App Router

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // App Router
// import { useRouter } from 'next/router'; // Pages Router

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
          setStatus(`Login failed: ${data.message || "Unknown error"}`);
          setTimeout(() => router.push("/signin"), 3000);
          return;
        }

        // Check if we got an auth token
        if (data.token) {
          console.log("Auth token received, logging in...");
          setStatus("Login successful! Redirecting...");

          // Store the token (adjust based on your auth system)
          localStorage.setItem("token", data.token);

          // Redirect to dashboard or home
          setTimeout(() => router.push("/nurseProfile"), 1000);
        } else {
          console.error("No auth token in response:", data);
          setStatus("Login failed - no token received");
          setTimeout(() => router.push("/signin"), 3000);
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