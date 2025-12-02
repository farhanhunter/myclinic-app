import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-helper";

const prisma = new PrismaClient();

// GET all clients
export async function GET() {
  // Check authentication
  const authResult = await requireAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const clients = await prisma.client.findMany({
      include: {
        pets: true,
        _count: {
          select: { examinations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients", details: String(error) },
      { status: 500 }
    );
  }
}

// POST create client
export async function POST(request: Request) {
  // Check authentication
  const authResult = await requireAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const body = await request.json();

    const client = await prisma.client.create({
      data: {
        nama: body.nama,
        alamat: body.alamat,
        noTelp: body.noTelp,
      },
      // Include the same relations as GET
      include: {
        pets: true,
        _count: {
          select: { examinations: true },
        },
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create client", details: String(error) },
      { status: 500 }
    );
  }
}
