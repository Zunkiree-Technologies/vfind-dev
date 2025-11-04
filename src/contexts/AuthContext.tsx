"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuthData,
  setAuthCookies,
  clearAuthCookies,
  isAuthenticated,
  getUserRole,
  migrateFromLocalStorage,
} from "@/utils/cookies";
import {
  registerSession,
  enforceSessionSync,
  clearSession,
} from "@/utils/authSync";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    email: string | null;
    role: "Nurse" | "Employer" | null;
    token: string | null;
  };
  login: (token: string, role: "Nurse" | "Employer", email: string) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: {
      email: string | null;
      role: "Nurse" | "Employer" | null;
      token: string | null;
    };
  }>({
    isAuthenticated: false,
    user: {
      email: null,
      role: null,
      token: null,
    },
  });

  // Initialize auth state from cookies
  useEffect(() => {
    // First, try to migrate from localStorage to cookies
    migrateFromLocalStorage();

    // Then load auth data
    refreshAuth();

    // Setup session monitoring to detect logins in other tabs
    const cleanup = enforceSessionSync(() => {
      // When another tab logs in, force logout this tab
      setAuthState({
        isAuthenticated: false,
        user: {
          email: null,
          role: null,
          token: null,
        },
      });

      // Show alert and redirect
      alert(
        "You have been logged out because another account was logged in from a different tab."
      );
      router.push("/");
    });

    return cleanup; // Cleanup on unmount
  }, [router]);

  const refreshAuth = () => {
    const authenticated = isAuthenticated();
    const authData = getAuthData();
    const role = getUserRole();

    setAuthState({
      isAuthenticated: authenticated,
      user: {
        email: authData.email,
        role: role,
        token: authData.token,
      },
    });
  };

  const login = (token: string, role: "Nurse" | "Employer", email: string) => {
    // Set cookies
    setAuthCookies(token, role, email);

    // Register this session (will trigger logout in other tabs if different account)
    registerSession(role, email);

    // Update state
    setAuthState({
      isAuthenticated: true,
      user: {
        email,
        role,
        token,
      },
    });
  };

  const logout = () => {
    // Clear cookies and localStorage
    clearAuthCookies();
    clearSession();

    // Update state
    setAuthState({
      isAuthenticated: false,
      user: {
        email: null,
        role: null,
        token: null,
      },
    });

    // Redirect to home page
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
