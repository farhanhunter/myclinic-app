-- CreateTable
CREATE TABLE "mst_account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "noTelp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "namaHewan" TEXT NOT NULL,
    "spesies" TEXT NOT NULL,
    "breed" TEXT,
    "beratBadan" DOUBLE PRECISION,
    "umur" INTEGER,
    "umurSatuan" TEXT,
    "gender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veterinarians" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nomorLisensi" TEXT,
    "spesialisasi" TEXT,
    "noTelp" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veterinarians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examinations" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "petId" INTEGER NOT NULL,
    "veterinarianId" INTEGER NOT NULL,
    "tanggalPemeriksaan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suhu" DOUBLE PRECISION,
    "heartRate" INTEGER,
    "penampilan" TEXT,
    "mata" TEXT,
    "telinga" TEXT,
    "hidung" TEXT,
    "mulut" TEXT,
    "kulitRambut" TEXT,
    "limfonodus" TEXT,
    "mukosa" TEXT,
    "abdomen" TEXT,
    "thoraks" TEXT,
    "gastro" TEXT,
    "respiratory" TEXT,
    "tulangDanOtot" TEXT,
    "ekstremitas" TEXT,
    "urogenital" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "prescription" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examinations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mst_account_username_key" ON "mst_account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "veterinarians_nomorLisensi_key" ON "veterinarians"("nomorLisensi");

-- CreateIndex
CREATE UNIQUE INDEX "veterinarians_email_key" ON "veterinarians"("email");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "veterinarians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
