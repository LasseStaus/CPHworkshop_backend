/*
  Warnings:

  - A unique constraint covering the columns `[typeOfTicket]` on the table `ticketTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_typeOfTicket_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "ticketTypes_typeOfTicket_key" ON "ticketTypes"("typeOfTicket");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_typeOfTicket_fkey" FOREIGN KEY ("typeOfTicket") REFERENCES "ticketTypes"("typeOfTicket") ON DELETE RESTRICT ON UPDATE CASCADE;
