import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single examination by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const examination = await prisma.examination.findUnique({
      where: { id },
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
    });

    if (!examination) {
      return NextResponse.json(
        { error: "Examination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(examination);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch examination", details: String(error) },
      { status: 500 }
    );
  }
}

// PUT update examination
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedExamination = await prisma.examination.update({
      where: { id },
      data: {
        clientId: body.clientId,
        petId: body.petId,
        veterinarianId: body.veterinarianId,
        tanggalPemeriksaan: body.tanggalPemeriksaan
          ? new Date(body.tanggalPemeriksaan)
          : undefined,
        suhu: body.suhu ? parseFloat(body.suhu) : null,
        heartRate: body.heartRate ? parseInt(body.heartRate) : null,
        penampilan: body.penampilan || null,
        mata: body.mata || null,
        telinga: body.telinga || null,
        hidung: body.hidung || null,
        mulut: body.mulut || null,
        kulitRambut: body.kulitRambut || null,
        limfonodus: body.limfonodus || null,
        mukosa: body.mukosa || null,
        abdomen: body.abdomen || null,
        thoraks: body.thoraks || null,
        gastro: body.gastro || null,
        respiratory: body.respiratory || null,
        tulangDanOtot: body.tulangDanOtot || null,
        ekstremitas: body.ekstremitas || null,
        urogenital: body.urogenital || null,
        diagnosis: body.diagnosis || null,
        treatment: body.treatment || null,
        prescription: body.prescription || null,
        notes: body.notes || null,
      },
      include: {
        client: true,
        pet: true,
        veterinarian: true,
      },
    });

    return NextResponse.json(updatedExamination);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update examination", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE examination
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.examination.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Examination deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete examination", details: String(error) },
      { status: 500 }
    );
  }
}
