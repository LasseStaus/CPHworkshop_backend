import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class deleteBookingDTO {
  @IsString()
  @IsNotEmpty()
  id: string
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date
  @IsDateString()
  @IsNotEmpty()
  bookedFor: Date
  @IsString()
  @IsNotEmpty()
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
