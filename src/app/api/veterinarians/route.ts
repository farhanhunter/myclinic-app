import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-helper";

const prisma = new PrismaClient();

// GET all veterinarians
export async function GET() {
  // Check authentication
  const authResult = await requireAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const vets = await prisma.veterinarian.findMany({
      include: {
        _count: {
          select: { examinations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vets);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch veterinarians", details: String(error) },
      { status: 500 }
    );
  }
}

// POST create veterinarian
export async function POST(request: Request) {
  // Check authentication
  const authResult = await requireAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const body = await request.json();

    const vet = await prisma.veterinarian.create({
      data: {
        nama: body.nama,
        nomorLisensi: body.nomorLisensi,
        spesialisasi: body.spesialisasi,
        noTelp: body.noTelp,
        email: body.email,
      },
      // Include the same relations as GET
      include: {
        _count: {
          select: { examinations: true },
        },
      },
    });

    return NextResponse.json(vet, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create veterinarian", details: String(error) },
      { status: 500 }
    );
  }
}
