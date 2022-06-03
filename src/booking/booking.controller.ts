import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { BookingDTO } from 'src/auth/dto'
import { GetUserId } from '../auth/decorator'
import { BookingService } from './booking.service'
import { deleteBookingDTO, updateBooking } from './dto/booking.dto'

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post('createBooking')
  createBooking(@GetUserId() id: string, @Body() bookingDto: BookingDTO) {
    return this.bookingService.createBooking(id, bookingDto)
  }

  @Get('userBookings')
  getUserBookings(@GetUserId() id: string) {
    return this.bookingService.getUserBookings(id)
  }

  @Get('allUserBookings')
  getAllUserBookings() {
    return this.bookingService.getAllUserBookings()
  }

  @Patch('updateBooking')
  updateBooking(@Body() bookingDto: updateBooking) {
    return this.bookingService.updateBooking(bookingDto)
  }

  @Post('deleteBooking')
  deleteBooking(@GetUserId() id: string, @Body() bookingDto: deleteBookingDTO) {
    return this.bookingService.deleteBooking(id, bookingDto)
  }
}
