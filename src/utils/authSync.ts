/**
 * Authentication Synchronization Utility
 * Handles multi-tab login conflicts and session management
 */

import { clearAuthCookies, getAuthData } from "./cookies";

// Unique session ID for this tab/window
let sessionId: string | null = null;

/**
 * Generate a unique session ID for this tab
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get or create session ID for this tab
 */
export function getSessionId(): string {
  if (!sessionId) {
    sessionId = generateSessionId();
    // Store in sessionStorage (tab-specific)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sessionId", sessionId);
    }
  }
  return sessionId;
}

/**
 * Store the current session ID in localStorage
 * This allows us to detect when another tab logs in
 */
export function registerSession(role: "Nurse" | "Employer", email: string): void {
  if (typeof window === "undefined") return;

  const currentSessionId = getSessionId();

  const sessionData = {
    sessionId: currentSessionId,
    role,
    email,
    timestamp: Date.now(),
  };

  localStorage.setItem("activeSession", JSON.stringify(sessionData));
}

/**
 * Check if this tab's session is still the active one
 * Returns false if another tab has logged in
 */
export function isActiveSession(): boolean {
  if (typeof window === "undefined") return true;

  const currentSessionId = sessionStorage.getItem("sessionId");
  const activeSessionData = localStorage.getItem("activeSession");

  if (!activeSessionData) return true; // No active session
  if (!currentSessionId) return false; // This tab has no session

  try {
    const { sessionId: activeSessionId } = JSON.parse(activeSessionData);
    return currentSessionId === activeSessionId;
  } catch {
    return false;
  }
}

/**
 * Get info about the active session (from another tab)
 */
export function getActiveSessionInfo(): {
  role: "Nurse" | "Employer" | null;
  email: string | null;
  sessionId: string | null;
} | null {
  if (typeof window === "undefined") return null;

  const activeSessionData = localStorage.getItem("activeSession");
  if (!activeSessionData) return null;

  try {
    return JSON.parse(activeSessionData);
  } catch {
    return null;
  }
}

/**
 * Clear session data
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("activeSession");
  sessionStorage.removeItem("sessionId");
  sessionId = null;
}

/**
 * Setup storage event listener to detect login in other tabs
 * Calls callback when another tab logs in
 */
export function setupSessionMonitor(
  onOtherTabLogin: (otherSessionInfo: { role: string; email: string }) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const currentSessionId = getSessionId();

  const handleStorageChange = (event: StorageEvent) => {
    // Only care about activeSession changes
    if (event.key !== "activeSession") return;
    if (!event.newValue) return; // Session was cleared

    try {
      const newSession = JSON.parse(event.newValue);

      // If the new session is different from our session, another tab logged in
      if (newSession.sessionId !== currentSessionId) {
        onOtherTabLogin({
          role: newSession.role,
          email: newSession.email,
        });
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
    }
  };

  window.addEventListener("storage", handleStorageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}

/**
 * Force logout if another tab has logged in with a different account
 */
export function enforceSessionSync(onForcedLogout?: () => void): () => void {
  return setupSessionMonitor((otherSessionInfo) => {
    const currentAuth = getAuthData();

    // If we have an active session but another tab logged in, force logout
    if (currentAuth.token && currentAuth.email !== otherSessionInfo.email) {
      console.warn(
        `Another tab logged in as ${otherSessionInfo.role} (${otherSessionInfo.email}). Logging out this tab.`
      );

      clearAuthCookies();
      clearSession();

      if (onForcedLogout) {
        onForcedLogout();
      } else {
        // Default: reload to show login page
        window.location.href = "/";
      }
    }
  });
}
