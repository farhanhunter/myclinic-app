import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Check if data already exists
  const existingVets = await prisma.veterinarian.count();
  if (existingVets > 0) {
    console.log("✅ Data already seeded, skipping...");
    return;
  }

  // Create Veterinarian
  const vet1 = await prisma.veterinarian.create({
    data: {
      nama: "Dr. Budi Santoso",
      nomorLisensi: "DRH-12345",
      spesialisasi: "Hewan Kecil",
      noTelp: "081234567890",
      email: "budi.vet@example.com",
    },
  });

  console.log("✅ Created Veterinarian:", vet1.nama);

  // Create Client
  const client1 = await prisma.client.create({
    data: {
      nama: "Farhan Hunter",
      alamat: "Jl. Merdeka No. 123, Jakarta",
      noTelp: "081234567891",
    },
  });

  console.log("✅ Created Client:", client1.nama);

  // Create Pet
  const pet1 = await prisma.pet.create({
    data: {
      clientId: client1.id,
      namaHewan: "Bobby",
      spesies: "Anjing",
      breed: "Golden Retriever",
      beratBadan: 25.5,
      umur: 3,
      umurSatuan: "tahun",
      gender: "Jantan",
    },
  });

  console.log("✅ Created Pet:", pet1.namaHewan);

  // Create Examination
  await prisma.examination.create({
    data: {
      clientId: client1.id,
      petId: pet1.id,
      veterinarianId: vet1.id,
      tanggalPemeriksaan: new Date(),
      suhu: 38.5,
      heartRate: 90,
      penampilan: "Baik, aktif",
      mata: "Normal, tidak ada discharge",
      telinga: "Bersih",
      hidung: "Lembab, tidak ada discharge",
      mulut: "Gigi bersih, tidak ada karang gigi",
      kulitRambut: "Sehat, tidak ada lesi",
      limfonodus: "Tidak membesar",
      mukosa: "Pink, CRT < 2 detik",
      abdomen: "Tidak ada nyeri tekan",
      thoraks: "Simetris, pergerakan normal",
      gastro: "Normal",
      respiratory: "Suara nafas normal",
      tulangDanOtot: "Tidak ada masalah",
      ekstremitas: "Pergerakan normal",
      urogenital: "Normal",
      diagnosis: "Sehat, check-up rutin",
      treatment: "Vaksinasi rabies",
      prescription: "Vitamin A, 1x sehari",
      notes: "Jadwal vaksinasi selanjutnya: 6 bulan",
    },
  });

  console.log("✅ Created Examination for", pet1.namaHewan);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
