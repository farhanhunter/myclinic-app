import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// READ: GET all pets
export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
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
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pets);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pets", details: String(error) },
      { status: 500 }
    );
  }
}

// CREATE: POST new pet
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pet = await prisma.pet.create({
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

    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create pet", details: String(error) },
      { status: 500 }
    );
  }
}
