import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { GetUserId } from '../auth/decorator'
import { BookingDTO } from 'src/auth/dto'
import { PrismaService } from '../prisma/prisma.service'
import { BookingService } from './booking.service'
import { deleteBookingDTO, updateBooking } from './dto/booking.dto'

@Controller('booking')
export class BookingController {
  constructor(
    private bookingService: BookingService,
    private prismaService: PrismaService
  ) {}

  @Post('createBooking') // method and path
  createBooking(@GetUserId() id: string, @Body() bookingDto: BookingDTO) {
    console.log('controller', JSON.stringify(bookingDto), id)

    // get info about the current user using costume decorator
    return this.bookingService.createBooking(id, bookingDto)
  }

  @Get('userBookings') // method and path
  getUserBookings(@GetUserId() id: string) {
    // get info about the current user using costume decorator
    return this.bookingService.getUserBookings(id)
  }

  @Get('allUserBookings') // method and path
  getAllUserBookings() {
    // get info about the current user using costume decorator
    return this.bookingService.getAllUserBookings()
  }

  @Patch('updateBooking') // method and path
  updateBooking(@Body() bookingDto: updateBooking) {
    console.log('vi er her')

    return this.bookingService.updateBooking(bookingDto)
  }

  @Post('deleteBooking') // method and path
  deleteBooking(@GetUserId() id: string, @Body() bookingDto: deleteBookingDTO) {
    console.log('controller', bookingDto)

    // get info about the current user using costume decorator
    return this.bookingService.deleteBooking(id, bookingDto.id)
  }
}
