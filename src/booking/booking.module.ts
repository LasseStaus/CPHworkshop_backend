import { Module } from '@nestjs/common'
import { TicketService } from 'src/ticket/ticket.service'
import { BookingController } from './booking.controller'
import { BookingService } from './booking.service'

@Module({
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
