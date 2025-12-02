import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Protected page routes
      const isOnProtectedPage =
        nextUrl.pathname.startsWith("/clients") ||
        nextUrl.pathname.startsWith("/pets") ||
        nextUrl.pathname.startsWith("/veterinarians") ||
        nextUrl.pathname.startsWith("/examinations");

      // Protected API routes
      const isOnProtectedApi =
        nextUrl.pathname.startsWith("/api/clients") ||
        nextUrl.pathname.startsWith("/api/pets") ||
        nextUrl.pathname.startsWith("/api/veterinarians") ||
        nextUrl.pathname.startsWith("/api/examinations");

      if (isOnProtectedPage || isOnProtectedApi) {
        if (isLoggedIn) return true;

        // For API routes, return false (will result in 401)
        // For page routes, return false (will redirect to login)
        return false;
      } else if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
