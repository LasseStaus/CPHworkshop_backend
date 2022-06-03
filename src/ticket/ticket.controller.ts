import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common'
import { GetUserId } from '../auth/decorator'
import { ticketDto } from './dto'
import { TicketService } from './ticket.service'

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get('data')
  getTickets(@GetUserId() id: string) {
    return this.ticketService.getTickets(id)
  }

  @Get('ticketTypes')
  getTicketTypes() {
    return this.ticketService.getTicketTypes()
  }

  @Get('purchases')
  getPurchases(@GetUserId() id: string) {
    return this.ticketService.getPurchases(id)
  }

  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  purchaseTicket(@GetUserId() userId: string, @Body() dto: ticketDto) {
    return this.ticketService.purchaseTicket(userId, dto)
  }
}
