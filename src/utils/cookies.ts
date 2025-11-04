/**
 * Cookie utility functions for secure authentication
 * Handles setting, getting, and removing cookies with proper security options
 */

export interface CookieOptions {
  days?: number; // Expiry in days (default: 7)
  path?: string; // Cookie path (default: "/")
  secure?: boolean; // HTTPS only (default: true in production)
  sameSite?: "strict" | "lax" | "none"; // CSRF protection (default: "strict")
}

/**
 * Set a cookie with security best practices
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  try {
    const {
      days = 7,
      path = "/",
      secure = process.env.NODE_ENV === "production",
      sameSite = "strict",
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Set expiry
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    // Add path
    cookieString += `; path=${path}`;

    // Add secure flag for HTTPS
    if (secure) {
      cookieString += "; secure";
    }

    // Add SameSite for CSRF protection
    cookieString += `; SameSite=${sameSite}`;

    document.cookie = cookieString;
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  try {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(
          cookie.substring(nameEQ.length, cookie.length)
        );
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
}

/**
 * Remove a cookie by setting it to expire
 */
export function removeCookie(name: string, path: string = "/"): void {
  try {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  } catch (error) {
    console.error("Error removing cookie:", error);
  }
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Set authentication cookies (token, role, email)
 */
export function setAuthCookies(
  token: string,
  role: "Nurse" | "Employer",
  email: string
): void {
  setCookie("authToken", token, { days: 7 });
  setCookie("userRole", role, { days: 7 });
  setCookie("userEmail", email, { days: 7 });
}

/**
 * Get all authentication data from cookies
 */
export function getAuthData(): {
  token: string | null;
  role: string | null;
  email: string | null;
} {
  return {
    token: getCookie("authToken"),
    role: getCookie("userRole"),
    email: getCookie("userEmail"),
  };
}

/**
 * Clear all authentication cookies (logout)
 */
export function clearAuthCookies(): void {
  removeCookie("authToken");
  removeCookie("userRole");
  removeCookie("userEmail");

  // Also clear localStorage for backward compatibility
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("authToken");
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return hasCookie("authToken");
}

/**
 * Get user role from cookies
 */
export function getUserRole(): "Nurse" | "Employer" | null {
  const role = getCookie("userRole");
  return role === "Nurse" || role === "Employer" ? role : null;
}

/**
 * Migrate from localStorage to cookies (for backward compatibility)
 * Call this on app initialization
 */
export function migrateFromLocalStorage(): void {
  if (typeof window === "undefined") return;

  try {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    const email = localStorage.getItem("email");

    // If we have localStorage data but no cookies, migrate it
    if (token && !hasCookie("authToken")) {
      // Try to determine role from current URL or localStorage
      const role = window.location.pathname.includes("EmployerDashboard")
        ? "Employer"
        : "Nurse";

      if (email) {
        setAuthCookies(token, role, email);
      }
    }
  } catch (error) {
    console.error("Error migrating from localStorage:", error);
  }
}
