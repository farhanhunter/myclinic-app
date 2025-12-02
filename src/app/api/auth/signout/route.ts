import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await signOut({ redirect: false });
    return NextResponse.json({ ok: true, message: "Logged out successfully" });
  } catch (error) {
    // Re-throw if it's a redirect (which is expected behavior from signOut)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      return NextResponse.json({
        ok: true,
        message: "Logged out successfully",
      });
    }

    console.error("Sign out error:", error);
    return NextResponse.json(
      { ok: false, error: "Sign out failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
