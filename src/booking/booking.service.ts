import { Injectable } from '@nestjs/common'
import { Booking, PrismaPromise } from '@prisma/client'
import { single } from 'rxjs'
import { BookingDTO } from 'src/auth/dto'
import { TicketService } from 'src/ticket/ticket.service'
import { PrismaService } from '../prisma/prisma.service'
import { deleteBookingDTO, updateBooking } from './dto/booking.dto'

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  async createBooking(userId: string, bookingDto: BookingDTO) {
    let amount: number
    const bookingArrayISO = []

    for (const booking in bookingDto) {
      const singleDate = bookingDto[booking]
      const date = new Date(singleDate)
      const singleBookingObject = {
        userId: userId,
        bookedFor: date.toISOString()
      }
      bookingArrayISO.push(singleBookingObject)
      amount + 1
    }
    try {
      const createBooking = this.prismaService.booking.createMany({
        data: bookingArrayISO,
        skipDuplicates: true // Skip 'Bobo'
      })

      console.log('UPDATE BY THIS MANY ', bookingArrayISO.length)

      const updateTickets = this.prismaService.ticket.update({
        where: {
          userId: userId
        },
        data: {
          activeTickets: {
            decrement: bookingArrayISO.length
          }
        }
      })

      //TODO what to return here?
      await this.prismaService.$transaction([createBooking, updateTickets])
      return createBooking
    } catch (err) {
      console.log('error in createBooking', err)
    }
  }

  /*   }
  async createBooking(userId: string, bookingDto: BookingDTO) {
    console.log('TRIED')

    let amount: number
    const bookingArrayISO = []

    for (const booking in bookingDto) {
      const singleDate = bookingDto[booking]
      const date = new Date(singleDate)
      const singleBookingObject = {
        userId: userId,
        bookedFor: date.toISOString()
      }
      bookingArrayISO.push(singleBookingObject)
      amount + 1
    }

    console.log('has array', bookingArrayISO)

    await this.prismaService.$transaction([
      this.prismaService.booking.createMany({
        data: bookingArrayISO,
        skipDuplicates: true 
      }),
      this.prismaService.ticket.update({
        where: {
          id: userId
        },
        data: {
          activeTickets: {
            increment: -1
          }
        }
      })
    ])
  } */

  /*  async createBooking(userId: string, bookingDto: BookingDTO) {
    let amount: number
    const bookingArrayISO = []

    for (const booking in bookingDto) {
      const singleDate = bookingDto[booking]
      const date = new Date(singleDate)
      const singleBookingObject = {
        userId: userId,
        bookedFor: date.toISOString()
      }
      bookingArrayISO.push(singleBookingObject)
      amount + 1
    }
    const booking = await this.prismaService.booking.createMany({
      data: bookingArrayISO,
      skipDuplicates: true // Skip 'Bobo'
    })

    console.log('done?', booking)
  }

  async updateTickets(userId: string) {
    const ticket = await this.prismaService.ticket.update({
      where: {
        id: userId
      },
      data: {
        activeTickets: {
          increment: -1
        }
      }
    })

    console.log('done?', ticket)
  } */

  async getUserBookings(userId: string) {
    try {
      const userBookings = await this.prismaService.booking.findMany({
        where: { userId: userId },
        take: 3,
        orderBy: { bookedFor: 'desc' }
      })

      console.log('get user bookings service', userBookings)
      return userBookings
    } catch (err) {
      console.log('Error in getUserBookings', err)
    }
  }

  async updateBooking(dto: updateBooking) {
    console.log('I backend', dto)

    try {
      const updateBooking = this.prismaService.booking.update({
        where: {
          id: dto.id
        },
        data: {
          iLOQKey: dto.iLOQKey
        }
      })
      console.log('UPDATE booking service', updateBooking)
      return updateBooking
    } catch (err) {
      console.log('Error in update booking', err)
    }
  }

  async deleteBooking(userId: string, booking: deleteBookingDTO) {
    try {
      const deleteBooking = this.prismaService.booking.delete({
        where: { id: booking.id }
      })

      const updateTickets = this.prismaService.ticket.update({
        where: {
          userId: userId
        },
        data: {
          activeTickets: {
            increment: 1
          },
          usedTickets: {
            decrement: 1
          }
        }
      })

      const data = await this.prismaService.$transaction([
        deleteBooking,
        updateTickets
      ])

      return data
    } catch (err) {
      throw new Error('Something went wrong, try agian later')
    }
  }

  async getAllUserBookings() {
    try {
      const allUserBookings = await this.prismaService.booking.findMany({
        include: {
          user: true // Return all fields
        },
        orderBy: { bookedFor: 'desc' }
      })

      console.log('get user bookings service', allUserBookings)
      return allUserBookings
    } catch (err) {
      console.log('Error in getUserBookings', err)
    }
  }
}
/* return  await this.prismaservice.$transaction([createBooking, updateTickets]) */
