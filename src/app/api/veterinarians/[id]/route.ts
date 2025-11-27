import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single veterinarian by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vet = await prisma.veterinarian.findUnique({
      where: { id },
      include: {
        _count: {
          select: { examinations: true },
        },
      },
    });

    if (!vet) {
      return NextResponse.json(
        { error: "Veterinarian not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vet);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch veterinarian", details: String(error) },
      { status: 500 }
    );
  }
}

// PUT update veterinarian
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedVet = await prisma.veterinarian.update({
      where: { id },
      data: {
        nama: body.nama,
        nomorLisensi: body.nomorLisensi || null,
        spesialisasi: body.spesialisasi || null,
        noTelp: body.noTelp || null,
        email: body.email || null,
      },
      include: {
        _count: {
          select: { examinations: true },
        },
      },
    });

    return NextResponse.json(updatedVet);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update veterinarian", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE veterinarian
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.veterinarian.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Veterinarian deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete veterinarian", details: String(error) },
      { status: 500 }
    );
  }
}
