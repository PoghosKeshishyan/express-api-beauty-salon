/*
  Warnings:

  - You are about to drop the column `masterId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_masterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_serviceId_fkey";

-- AlterTable
ALTER TABLE "public"."Client" DROP COLUMN "masterId",
DROP COLUMN "serviceId";

-- CreateTable
CREATE TABLE "public"."_ClientMasters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClientMasters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ClientServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClientServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClientMasters_B_index" ON "public"."_ClientMasters"("B");

-- CreateIndex
CREATE INDEX "_ClientServices_B_index" ON "public"."_ClientServices"("B");

-- AddForeignKey
ALTER TABLE "public"."_ClientMasters" ADD CONSTRAINT "_ClientMasters_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientMasters" ADD CONSTRAINT "_ClientMasters_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientServices" ADD CONSTRAINT "_ClientServices_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClientServices" ADD CONSTRAINT "_ClientServices_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
