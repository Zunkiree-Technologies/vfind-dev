"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const completeLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) return;

      try {
        const response = await fetch(
          `https://x76o-gnx4-xrav.a2.xano.io/api:U0aE1wpF/oauth/google/continue?code=${code}`,
          { method: "GET" }
        );

        const data = await response.json();

        if (response.ok && data.authToken) {
          localStorage.setItem("token", data.authToken);
          localStorage.setItem("email", data.user?.email || "");
          router.push("/nurseProfile");
        } else {
          console.error("OAuth failed:", data);
          router.push("/login?error=google_oauth_failed");
        }
      } catch (error) {
        console.error("OAuth error:", error);
        router.push("/login?error=google_oauth_error");
      }
    };

    completeLogin();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Completing Google login...</p>
    </div>
  );
}
