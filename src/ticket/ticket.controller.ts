import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common'
import { GetUserId } from 'src/auth/decorator'
import { TicketDto } from './dto'
import { TicketService } from './ticket.service'

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get('data') // method and path
  getTickets(@GetUserId() id: string) {
    // get info about the current user using costume decorator
    return this.ticketService.getTickets(id)
  }

  @Get('purchases') // method and path
  getPurchases(@GetUserId() id: string) {
    // get info about the current user using costume decorator
    return this.ticketService.getPurchases(id)
  }

  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  purchaseTicket(@GetUserId() userId: string, @Body() dto: TicketDto) {
    return this.ticketService.purchaseTicket(userId, dto)
  }
}
