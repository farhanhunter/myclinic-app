import { signIn } from "@/auth";
import { NextResponse } from "next/server";
import { AuthError, CredentialsSignin } from "next-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return NextResponse.json({ ok: true, message: "Login successful" });
  } catch (error: unknown) {
    // Handle NEXT_REDIRECT - this is actually a successful sign-in
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      return NextResponse.json({ ok: true, message: "Login successful" });
    }

    // Handle CredentialsSignin error specifically
    if (error instanceof CredentialsSignin) {
      return NextResponse.json(
        { ok: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Handle other AuthError types
    if (error instanceof AuthError) {
      console.error("Auth error:", error.type, error.message);

      if (error.type === "CredentialsSignin") {
        return NextResponse.json(
          { ok: false, error: "Invalid username or password" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { ok: false, error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Handle generic errors
    if (error instanceof Error) {
      // Check for redirect in message (fallback)
      if (error.message.includes("NEXT_REDIRECT")) {
        return NextResponse.json({ ok: true, message: "Login successful" });
      }

      console.error("Sign in error:", error.message);
    } else {
      console.error("Sign in error:", error);
    }

    return NextResponse.json(
      { ok: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
