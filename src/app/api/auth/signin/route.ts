import { signIn } from "@/auth";
import { NextResponse } from "next/server";
import { AuthError } from "next-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return NextResponse.json({ ok: true, message: "Login successful" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            { ok: false, error: "Invalid username or password" },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { ok: false, error: "Authentication failed" },
            { status: 500 }
          );
      }
    }

    // Re-throw if it's a redirect (which is expected behavior from signIn)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      return NextResponse.json({ ok: true, message: "Login successful" });
    }

    console.error("Sign in error:", error);
    return NextResponse.json(
      { ok: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
