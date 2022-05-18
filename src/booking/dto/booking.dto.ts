export type deleteBookingDTO = {
  id: string
  createdAt: Date
  bookedFor: Date
  userId: string
}

export type updateBooking = {
  id: string
  iLOQKey: string
}
