import { IsNotEmpty, IsString } from 'class-validator'

export class deleteBookingDTO {
  id: string
  createdAt: Date
  bookedFor: Date
  userId: string
}

export class updateBooking {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  iLOQKey: string
}
