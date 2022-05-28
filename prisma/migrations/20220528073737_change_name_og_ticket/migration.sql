/*
  Warnings:

  - You are about to drop the column `ticketTypeId` on the `purchases` table. All the data in the column will be lost.
  - You are about to drop the column `ticketType` on the `ticketTypes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[typeOfTicket]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `typeOfTicket` to the `purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfTicket` to the `ticketTypes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_ticketTypeId_fkey";

-- DropIndex
DROP INDEX "purchases_ticketTypeId_key";

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "ticketTypeId",
ADD COLUMN     "typeOfTicket" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ticketTypes" DROP COLUMN "ticketType",
ADD COLUMN     "typeOfTicket" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "purchases_typeOfTicket_key" ON "purchases"("typeOfTicket");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_typeOfTicket_fkey" FOREIGN KEY ("typeOfTicket") REFERENCES "ticketTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
