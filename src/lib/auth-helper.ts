import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { Session } from "next-auth";

export async function getAuthSession() {
  const session = await auth();
  return session;
}

export async function requireAuth() {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized - Please login to access this resource" },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    session,
    user: session.user,
  };
}

export async function requireRole(allowedRoles: string[]) {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized - Please login to access this resource" },
        { status: 401 }
      ),
    };
  }

  const userRole = session.user.role || "user";

  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error:
            "Forbidden - You don't have permission to access this resource",
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    session,
    user: session.user,
  };
}

// Helper type for auth check results
export type AuthResult = {
  authorized: boolean;
  response?: NextResponse;
  session?: Session | null;
  user?: Session["user"];
};
