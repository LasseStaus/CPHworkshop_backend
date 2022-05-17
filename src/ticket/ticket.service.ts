import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { domainToASCII } from 'url';
import { TicketDto } from './dto';

@Injectable()
export class TicketService {

    constructor(private prismaservice: PrismaService) { }

    async purchaseTicket(userId: string, dto: TicketDto) {

        try {
            const createTicketPurchase = this.prismaservice.purchase.create({
                data: {
                    amountOfTickets: dto.amountOfTickets,
                    paymentMethod: "Mobilepay",
                    userId: userId,
                }
            })

            const updateTicket = this.prismaservice.ticket.update({
                where: {
                    userId: userId
                },
                data: {
                    activeTickets: {
                        increment: +dto.amountOfTickets,
                    }
                }
            })

            await this.prismaservice.$transaction([createTicketPurchase, updateTicket])

        } catch (err) {
            throw new Error('Something went wrong, try agian later')

        }
    }

}
