import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetUserId } from 'src/auth/decorator';
import { TicketDto } from './dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {

    constructor(private ticketService: TicketService) { }

    @Post('purchase')
    @HttpCode(HttpStatus.OK)
    purchaseTicket(@GetUserId() userId: string, @Body() dto: TicketDto) {

        return this.ticketService.purchaseTicket(userId, dto)
    }

}
