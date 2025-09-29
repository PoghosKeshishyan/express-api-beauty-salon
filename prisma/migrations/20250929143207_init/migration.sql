/*
  Warnings:

  - Added the required column `masterId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "masterId" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "public"."Master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
