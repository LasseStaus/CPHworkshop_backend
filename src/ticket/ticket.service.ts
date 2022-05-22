import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ticketDto } from './dto/ticket.dto'

@Injectable()
export class TicketService {
  constructor(private prismaservice: PrismaService) {}

  async getPurchases(userId: string) {
    const purchases = await this.prismaservice.purchase.findMany({
      where: {
        userId: userId
      }
    })
    console.log(purchases)

    return purchases
  }

  async getTickets(userId: string) {
    const tickets = await this.prismaservice.ticket.findUnique({
      where: {
        userId: userId
      }
    })
    return tickets
  }

  async getTicketTypes() {
    const tickets = await this.prismaservice.ticketType.findMany({})
    return tickets
  }

  async purchaseTicket(userId: string, dto: ticketDto) {
    console.log('purchase ticket', dto, typeof dto)

    try {
      const createTicketPurchase = this.prismaservice.purchase.create({
        data: {
          amountOfTickets: dto.amountOfTickets,
          paymentMethod: 'Mobilepay',
          userId: userId
        }
      })

      const updateTicket = this.prismaservice.ticket.update({
        where: {
          userId: userId
        },
        data: {
          activeTickets: {
            increment: +dto.amountOfTickets
          }
        }
      })

      const data = await this.prismaservice.$transaction([
        createTicketPurchase,
        updateTicket
      ])

      return data
    } catch (err) {
      throw new Error('Something went wrong, try agian later')
    }
  }
}
