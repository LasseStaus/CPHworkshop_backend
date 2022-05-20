-- CreateTable
CREATE TABLE "ticketTypes" (
    "id" TEXT NOT NULL,
    "ticketType" TEXT NOT NULL,
    "nowPrice" INTEGER NOT NULL,
    "normalPrice" INTEGER NOT NULL,
    "ticketsAmount" INTEGER NOT NULL,

    CONSTRAINT "ticketTypes_pkey" PRIMARY KEY ("id")
);
