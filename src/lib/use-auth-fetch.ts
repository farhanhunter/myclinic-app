"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuthFetch() {
  const router = useRouter();

  const authFetch = useCallback(
    async (url: string, options?: RequestInit) => {
      const response = await fetch(url, options);

      // If 401 Unauthorized, redirect to login
      if (response.status === 401) {
        router.push("/login");
        throw new Error("Unauthorized - Redirecting to login");
      }

      return response;
    },
    [router]
  );

  return { authFetch };
}

// Helper function for non-hook contexts
export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401) {
    // Redirect using window.location for non-hook contexts
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized - Redirecting to login");
  }

  return response;
}
