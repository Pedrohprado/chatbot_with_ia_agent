-- CreateEnum
CREATE TYPE "STATE" AS ENUM ('START', 'INITIAL');

-- CreateTable
CREATE TABLE "whatsAppSession" (
    "id" TEXT NOT NULL,
    "state" "STATE" NOT NULL,

    CONSTRAINT "whatsAppSession_pkey" PRIMARY KEY ("id")
);
