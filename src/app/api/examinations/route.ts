import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all examinations
export async function GET() {
  try {
    const examinations = await prisma.examination.findMany({
      include: {
        client: {
          select: {
            id: true,
            nama: true,
            noTelp: true,
          },
        },
        pet: {
          select: {
            id: true,
            namaHewan: true,
            spesies: true,
          },
        },
        veterinarian: {
          select: {
            id: true,
            nama: true,
            spesialisasi: true,
          },
        },
      },
      orderBy: { tanggalPemeriksaan: "desc" },
    });
    return NextResponse.json(examinations);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch examinations", details: String(error) },
      { status: 500 }
    );
  }
}

// POST create examination
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const examination = await prisma.examination.create({
      data: {
        clientId: body.clientId,
        petId: body.petId,
        veterinarianId: body.veterinarianId,
        tanggalPemeriksaan: body.tanggalPemeriksaan
          ? new Date(body.tanggalPemeriksaan)
          : new Date(),
        suhu: body.suhu ? parseFloat(body.suhu) : null,
        heartRate: body.heartRate ? parseInt(body.heartRate) : null,
        penampilan: body.penampilan,
        mata: body.mata,
        telinga: body.telinga,
        hidung: body.hidung,
        mulut: body.mulut,
        kulitRambut: body.kulitRambut,
        limfonodus: body.limfonodus,
        mukosa: body.mukosa,
        abdomen: body.abdomen,
        thoraks: body.thoraks,
        gastro: body.gastro,
        respiratory: body.respiratory,
        tulangDanOtot: body.tulangDanOtot,
        ekstremitas: body.ekstremitas,
        urogenital: body.urogenital,
        diagnosis: body.diagnosis,
        treatment: body.treatment,
        prescription: body.prescription,
        notes: body.notes,
      },
      include: {
        client: true,
        pet: true,
        veterinarian: true,
      },
    });

    return NextResponse.json(examination, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to create examination", details: String(error) },
      { status: 500 }
    );
  }
}
