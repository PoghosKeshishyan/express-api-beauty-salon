-- AlterTable
ALTER TABLE "public"."BusyDates" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "serviceId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."BusyDates" ADD CONSTRAINT "BusyDates_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BusyDates" ADD CONSTRAINT "BusyDates_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
