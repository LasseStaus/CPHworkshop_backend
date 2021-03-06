import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ticketDto } from './dto/ticket.dto'

@Injectable()
export class TicketService {
  constructor(private prismaservice: PrismaService) {}

  // #####################################

  async getPurchases(userId: string) {
    const purchases = await this.prismaservice.purchase.findMany({
      where: {
        userId: userId
      }
    })
    return purchases
  }

  // #####################################

  async getTickets(userId: string) {
    const tickets = await this.prismaservice.ticket.findUnique({
      where: {
        userId: userId
      }
    })
    return tickets
  }

  // #####################################

  async getTicketTypes() {
    const tickets = await this.prismaservice.ticketType.findMany({})
    return tickets
  }

  // #####################################

  async purchaseTicket(userId: string, dto: ticketDto) {
    try {
      const createTicketPurchase = this.prismaservice.purchase.create({
        data: {
          paymentMethod: 'Mobilepay',
          userId: userId,
          typeOfTicket: dto.typeOfTicket
        }
      })

      // get amount of tickets from ticketType string
      const amountOfTickets = parseInt(dto.typeOfTicket.replace('days', ''))

      const updateTicket = this.prismaservice.ticket.update({
        where: {
          userId: userId
        },
        data: {
          activeTickets: {
            increment: +amountOfTickets
          }
        }
      })

      const data = await this.prismaservice.$transaction([
        createTicketPurchase,
        updateTicket
      ])

      return data
    } catch (err) {
      throw new Error(err)
    }
  }
}
