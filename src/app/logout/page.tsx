"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch("/api/auth/signout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          setStatus("success");
          // Redirect to login page after successful logout
          setTimeout(() => {
            router.push("/login");
            router.refresh();
          }, 1500);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Logout error:", err);
        setStatus("error");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Signing out...
            </h1>
            <p className="text-gray-600">Please wait while we log you out.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Logged out successfully
            </h1>
            <p className="text-gray-600">Redirecting to login page...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Logout failed
            </h1>
            <p className="text-gray-600 mb-4">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mr-2"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
