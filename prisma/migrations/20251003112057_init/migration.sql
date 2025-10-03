/*
  Warnings:

  - You are about to drop the column `durationInMs` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "durationInMs",
ADD COLUMN     "durationInMinute" INTEGER;
