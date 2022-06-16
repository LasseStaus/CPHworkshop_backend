import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { Roles } from 'src/auth/decorator/check-role.decorator'
import { BookingDTO } from 'src/auth/dto'
import { Role } from 'src/auth/enums/role.enum'
import { RolesGuard } from 'src/auth/guard/role.guard'
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

  @Get('allBookings')
  getAllBookings() {
    return this.bookingService.getAllBookings()
  }

  @Post('deleteBooking')
  deleteBooking(@GetUserId() id: string, @Body() bookingDto: deleteBookingDTO) {
    return this.bookingService.deleteBooking(id, bookingDto)
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('allBookingsWithUserInfo')
  allBookingsWithUserInfo() {
    return this.bookingService.allBookingsWithUserInfo()
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Patch('updateBookingKey')
  updateBookingKey(@Body() bookingDto: updateBooking) {
    return this.bookingService.updateBookingKey(bookingDto)
  }
}
