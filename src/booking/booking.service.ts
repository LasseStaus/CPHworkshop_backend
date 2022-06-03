import { Injectable } from '@nestjs/common'
import { BookingDTO } from 'src/auth/dto'
import { PrismaService } from '../prisma/prisma.service'
import { deleteBookingDTO, updateBooking } from './dto/booking.dto'

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  // #####################################

  async createBooking(userId: string, bookingDto: BookingDTO) {
    // let amount: number

    const bookingArrayISO = []
    for (const booking in bookingDto) {
      const singleDate = bookingDto[booking]
      const date = new Date(singleDate)
      const singleBookingObject = {
        userId: userId,
        bookedFor: date.toISOString()
      }
      bookingArrayISO.push(singleBookingObject)
      // amount + 1
    }
    try {
      const createBooking = this.prismaService.booking.createMany({
        data: bookingArrayISO,
        skipDuplicates: true
      })

      const updateTickets = this.prismaService.ticket.update({
        where: {
          userId: userId
        },
        data: {
          activeTickets: {
            decrement: bookingArrayISO.length
          },
          usedTickets: {
            increment: bookingArrayISO.length
          }
        }
      })

      const bookings = await this.prismaService.$transaction([
        createBooking,
        updateTickets
      ])

      const userBookings = await this.getUserBookings(userId)
      const allUserBookings = await this.getAllUserBookings()

      return {
        tickets: bookings[1],
        userBookings: userBookings,
        allUserBookings: allUserBookings
      }
    } catch (err) {
      throw new Error('Could not create new bookings')
    }
  }

  // #####################################

  async getUserBookings(userId: string) {
    try {
      const userBookings = await this.prismaService.booking.findMany({
        where: { userId: userId },
        orderBy: { bookedFor: 'asc' }
      })

      return userBookings
    } catch (err) {
      throw new Error('Could not get user bookings')
    }
  }

  // #####################################

  async updateBooking(dto: updateBooking) {
    try {
      const updateBooking = this.prismaService.booking.update({
        where: {
          id: dto.id
        },
        data: {
          iLOQKey: dto.iLOQKey
        }
      })
      return updateBooking
    } catch (err) {
      throw new Error('Something went wrong, try agian later')
    }
  }

  // #####################################

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

      const allUserBookings = await this.getAllUserBookings()

      return {
        deletedBooking: data[0],
        updatedTickets: data[1],
        allUserBookings: allUserBookings
      }
    } catch (err) {
      throw new Error('Could not delete booking')
    }
  }

  // #####################################

  async getAllUserBookings() {
    try {
      const allUserBookings = await this.prismaService.booking.findMany({
        include: {
          user: true // Return all fields
        },
        orderBy: { bookedFor: 'asc' }
      })
      return allUserBookings
    } catch (err) {
      throw new Error('Could not get all user bookings')
    }
  }
}
