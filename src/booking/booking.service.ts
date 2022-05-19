import { Injectable } from '@nestjs/common'
import { Booking, PrismaPromise } from '@prisma/client'
import { single } from 'rxjs'
import { BookingDTO } from 'src/auth/dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) { }

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
            increment: -bookingArrayISO.length
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
  async deleteBooking(userId: string, bookingId: string) {
    console.log(bookingId, 'in service')

    try {
      const deleteBooking = await this.prismaService.booking.delete({
        where: { id: bookingId }
      })

      console.log('booking should be deleted', deleteBooking)
      return deleteBooking
    } catch (err) {
      console.log('Error in getUserBookings', err)
    }
  }
}
/* return  await this.prismaservice.$transaction([createBooking, updateTickets]) */
