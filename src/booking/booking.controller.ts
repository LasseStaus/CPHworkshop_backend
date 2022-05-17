import { Body, Controller, Patch, Post } from '@nestjs/common'
import { GetUserId } from 'src/auth/decorator'
import { BookingDTO } from 'src/auth/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { BookingService } from './booking.service'

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
  /* 
  @Patch('update')
  editUser(@GetUserId() id: string, @Body() dto: EditUserDto) {
    return this.userservice.editUser(id, dto)
  } */
}
