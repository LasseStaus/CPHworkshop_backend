import { IsString } from 'class-validator'

export class ticketDto {
  @IsString()
  typeOfTicket: string
}
