import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Seeding accounts...");

  const existingAccounts = await prisma.account.count();
  if (existingAccounts > 0) {
    console.log("✅ Accounts already seeded, skipping...");
    return;
  }

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);
  const doctorPassword = await bcrypt.hash("budi123", 10);

  await prisma.account.create({
    data: {
      username: "admin",
      password: adminPassword,
      name: "Administrator",
      role: "admin",
      isActive: true,
    },
  });
  console.log("✅ Created admin: admin");

  await prisma.account.create({
    data: {
      username: "user",
      password: userPassword,
      name: "Regular User",
      role: "user",
      isActive: true,
    },
  });
  console.log("✅ Created user: user");

  await prisma.account.create({
    data: {
      username: "dr. budi",
      password: doctorPassword,
      name: "Dr. Budi Santoso",
      role: "doctor",
      isActive: true,
    },
  });
  console.log("✅ Created doctor: dr.budi");

  console.log("\n🎉 Accounts seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
