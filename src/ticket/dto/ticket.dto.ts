import { IsNumber } from 'class-validator'

export class ticketDto {
  @IsNumber()
  amountOfTickets: number
}
