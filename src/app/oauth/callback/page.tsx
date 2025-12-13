"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthCookies } from "@/utils/cookies";
import { supabase } from "@/lib/supabase";

export default function OAuthCallback() {
  const [status, setStatus] = useState("Processing...");
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check for OAuth errors from URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get("error");
        const errorDescription = urlParams.get("error_description");

        if (error) {
          console.error("OAuth error:", error, errorDescription);
          setStatus(errorDescription || "Login cancelled or failed");
          setTimeout(() => router.push("/signin"), 2000);
          return;
        }

        setStatus("Completing sign-in...");

        // For Supabase OAuth, the session is automatically handled via the hash fragment
        // We need to check if there's a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setStatus("Failed to complete sign-in");
          setTimeout(() => router.push("/signin?error=session-error"), 3000);
          return;
        }

        if (session) {
          const user = session.user;
          console.log("OAuth user:", user);

          // Check if this user exists in our nurses table
          const { data: nurseData } = await supabase
            .from('nurses')
            .select('id, full_name, email')
            .eq('email', user.email)
            .single();

          if (!nurseData) {
            // User doesn't have an account yet
            setStatus("No account found with this email. Please sign up first.");
            await supabase.auth.signOut();
            setTimeout(() => router.push("/signup?message=create-account-first"), 3000);
            return;
          }

          // Create our custom token format
          const customToken = `nurse_${nurseData.id}_${Date.now()}`;

          // Store authentication data
          setAuthCookies(customToken, "Nurse", user.email || "");
          localStorage.setItem("token", customToken);
          localStorage.setItem("email", user.email || "");
          localStorage.setItem("userName", nurseData.full_name || user.user_metadata?.full_name || "");

          setStatus("Login successful! Redirecting...");
          setTimeout(() => router.push("/nurseProfile"), 1000);
        } else {
          // No session found, try to exchange the code
          const code = urlParams.get("code");

          if (code) {
            // Exchange code for session
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError || !data.session) {
              console.error("Code exchange failed:", exchangeError);
              setStatus("Failed to complete sign-in");
              setTimeout(() => router.push("/signin?error=code-exchange-failed"), 3000);
              return;
            }

            // Recursively handle the session
            handleOAuthCallback();
            return;
          }

          setStatus("No authorization found. Please try again.");
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