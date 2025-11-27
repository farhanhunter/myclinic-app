import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await signOut({ redirect: false });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { ok: false, error: "Sign out failed" },
      { status: 500 }
    );
  }
}
