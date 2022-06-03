-- This is an empty migration.
ALTER TABLE "tickets"
ADD CONSTRAINT "activeTickets" 
CHECK ( "activeTickets" >= 0 )