-- CreateTable
CREATE TABLE "public"."BusyDates" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "masterId" TEXT,

    CONSTRAINT "BusyDates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BusyDates" ADD CONSTRAINT "BusyDates_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "public"."Master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
