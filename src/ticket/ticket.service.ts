import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { domainToASCII } from 'url'
import { TicketDto } from './dto'

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

  async purchaseTicket(userId: string, dto: TicketDto) {
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

      console.log('vi er her 2')

      return await this.prismaservice.$transaction([
        createTicketPurchase,
        updateTicket
      ])
    } catch (err) {
      throw new Error('Something went wrong, try agian later')
    }
  }
}
