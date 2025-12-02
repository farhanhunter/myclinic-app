import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-helper";

const prisma = new PrismaClient();

// GET single client
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authResult = await requireAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id } = await params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        pets: true,
        _count: {
          select: { examinations: true },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch client", details: String(error) },
      { status: 500 }
    );
  }
}

// PUT update client
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authResult = await requireAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const client = await prisma.client.update({
      where: { id },
      data: {
        nama: body.nama,
        alamat: body.alamat,
        noTelp: body.noTelp,
      },
      // Include the same relations
      include: {
        pets: true,
        _count: {
          select: { examinations: true },
        },
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update client", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE client
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authResult = await requireAuth();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { id } = await params;

    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete client", details: String(error) },
      { status: 500 }
    );
  }
}
