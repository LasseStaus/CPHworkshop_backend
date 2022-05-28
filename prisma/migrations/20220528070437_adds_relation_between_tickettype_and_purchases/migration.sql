/*
  Warnings:

  - You are about to drop the column `amountOfTickets` on the `purchases` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticketTypeId]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticketTypeId` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "amountOfTickets",
ADD COLUMN     "ticketTypeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "purchases_ticketTypeId_key" ON "purchases"("ticketTypeId");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "ticketTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
