/*
  Warnings:

  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - The `price` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "duration",
ADD COLUMN     "durationInMs" INTEGER,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION;
