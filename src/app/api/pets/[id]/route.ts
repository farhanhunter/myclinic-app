import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// READ ONE: GET single pet by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ← AWAIT params

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            nama: true,
            noTelp: true,
          },
        },
        _count: {
          select: { examinations: true },
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 });
    }

    return NextResponse.json(pet);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pet", details: String(error) },
      { status: 500 }
    );
  }
}

// UPDATE: PUT/PATCH update pet
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ← AWAIT params
    const body = await request.json();

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        clientId: body.clientId,
        namaHewan: body.namaHewan,
        spesies: body.spesies,
        breed: body.breed || null,
        beratBadan: body.beratBadan ? parseFloat(body.beratBadan) : null,
        umur: body.umur ? parseInt(body.umur) : null,
        umurSatuan: body.umurSatuan || null,
        gender: body.gender,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(updatedPet);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update pet", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE: DELETE pet
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ← AWAIT params

    await prisma.pet.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Pet deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete pet", details: String(error) },
      { status: 500 }
    );
  }
}
