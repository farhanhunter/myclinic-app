import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { ok: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
