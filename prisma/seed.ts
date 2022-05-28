import { Prisma, PrismaClient } from '@prisma/client'
import * as argon from 'argon2'
import { hashConfig } from '../src/auth/helpers/hashconfig'

const prisma = new PrismaClient()

const ticketTypeData: Prisma.TicketTypeCreateInput[] = [
  {
    typeOfTicket: '3 days',
    ticketsAmount: 3,
    normalPrice: 570,
    nowPrice: 456
  },
  {
    typeOfTicket: '7 days',
    ticketsAmount: 7,
    normalPrice: 1330,
    nowPrice: 931
  },
  {
    typeOfTicket: '30 days',
    ticketsAmount: 30,
    normalPrice: 5700,
    nowPrice: 3705
  }
]

async function seedAdmin() {
  const hash = await argon.hash('1234Admin', { ...hashConfig })
  console.log(`Seeding admin...`)
  const user = await prisma.user.create({
    data: {
      firstname: 'Astrid',
      lastname: 'Alomstrøm',
      email: 'admin@admin.com',
      phonenumber: '34343434',
      isAdmin: true,
      hash: hash
    }
  })
  await prisma.ticket.create({
    data: {
      activeTickets: 0,
      usedTickets: 0,
      userId: user.id
    }
  })

  console.log(`Created admin with email: ${user.email}`)
}

async function seedTicketTypes() {
  console.log(`Seeding ticket types...`)
  for (const type of ticketTypeData) {
    const ticketType = await prisma.ticketType.create({
      data: type
    })
    console.log(`Created ticket type with: ${ticketType.typeOfTicket}`)
  }
  console.log(`Seeding finished.`)
}

seedAdmin()
  .then(seedTicketTypes)
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

/* async function createAdmin() {
  const hash = await argon.hash('1234Admin', { ...hashConfig })
  const user = await this.prisma.user.create({
    data: {
      firstname: 'astrid',
      lastname: 'blomstrøm',
      email: 'admin@admin.com',
      phonenumber: '34343434',
      hash: hash,
      isAdmin: true
    }
  })

  const ticket = await this.prismaService.ticket.create({
    data: {
      activeTickets: 0,
      usedTickets: 0,
      userId: user.id
    }
  })
}

createAdmin() */
