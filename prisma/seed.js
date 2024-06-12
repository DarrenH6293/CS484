const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const Plumbing = await prisma.type.upsert({
    where: { id: 1 },
    update: {},
    create: {
        name: "Plumbing"
    },
  })

  const Lawncare = await prisma.type.upsert({
    where: { id: 2 },
    update: {},
    create: {
        name: "Lawncare"
    },
  })

  const Electrical = await prisma.type.upsert({
    where: { id: 3 },
    update: {},
    create: {
        name: "Electrical"
    },
  })

  const Roofing = await prisma.type.upsert({
    where: { id: 4 },
    update: {},
    create: {
        name: "Roofing"
    },
  })

  const Pest_Control = await prisma.type.upsert({
    where: { id: 5 },
    update: {},
    create: {
        name: "Pest Control"
    },
  })

  const Cleaning = await prisma.type.upsert({
    where: { id: 5 },
    update: {},
    create: {
        name: "Cleaning"
    },
  })

  const Bob = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Bob Joe",
        email: "bobjoe@mail.com",
        password: '$2a$10$84oyAnFXYhrFoHPx1Qm/OeYoVFr2jHKJsC9.5LPmTnXvLLfpRb5Yu',
        phone: '1231234321'
    },
  })

  const Jane = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
        role: "CUSTOMER",
        displayName: "Jane Joe",
        email: "janedoe@mail.com",
        password: '$2a$10$FvXwmDWSRgh80pvFepzfZ.dYdevSeB/SVXp6zZvStafMyGvyn8xB.',
        phone: '3234567890'
    },
  })

  const Ben = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Ben",
        email: "benten@mail.com",
        password: '$2a$10$JHiKJ6MeN.LL1BEcwgT4VeTFZ9Enkgj70II8OICI17uvV/B8EYVCa',
        phone: '1020309293'
    },
  })

  const Abby = await prisma.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Abby",
        email: "abby@mail.com",
        password: '$2a$10$ikQRjQRyxZpBZIdEoLUOt.fQv37eSVViWbOG1/GIQqyX8ONa1GBJ.',
        phone: '2232233344'
    },
  })

  const Carl = await prisma.user.upsert({
    where: { id: 5 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Carl",
        email: "carljr@mail.com",
        password: '$2a$10$NPW5YTm2k3JXFdKaty7tz.9eAAeR.gipjastfhVav3xVa7k3Op50y',
        phone: '4204204201'
    },
  })

  const Hank = await prisma.user.upsert({
    where: { id: 6 },
    update: {},
    create: {
        role: "VENDOR",
        displayName: "Hank",
        email: "hankgreen@mail.com",
        password: '$2a$10$O2u6VcwMgKkVcjLPaOVoCe0JfXAPo/eis.MHJvMwtE9kNSCyuyr1a',
        phone: '6904293029'
    },
  })

  const Cleaner = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
        minPrice: 100,
        maxPrice: 1000,
        address: '1 Grand Ave, San Luis Obispo, CA 93407',
        name: "Sparkle Cleaners",
        description: 'Cleaning services.',
        vendor: {connect: Bob},
        type: {connect: Cleaning},
        image:'../public/images/vendor/1.png'
    },
  })

  const Plumber = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
        minPrice: 300,
        maxPrice: 2000,
        address: '39145 Farwell Dr, Fremont, CA 94538',
        name: "Plumb Perfect",
        description: 'Plumbing service.',
        vendor: {connect: Ben},
        type: {connect: Plumbing},
        image:'../public/images/vendor/2.png'
    },
  })

  const Mower = await prisma.service.upsert({
    where: { id: 3 },
    update: {},
    create: {
        minPrice: 100,
        maxPrice: 500,
        address: '1210 S Bradley Rd, Santa Maria, CA 93454',
        name: "Lavsival Lawn Care",
        description: 'Lawn Services.',
        vendor: {connect: Ben},
        type: {connect: Lawncare},
        image:'../public/images/vendor/3.png'
    },
  })

  const Roofer = await prisma.service.upsert({
    where: { id: 4 },
    update: {},
    create: {
        minPrice: 200,
        maxPrice: 750,
        address: '11966 Los Osos Valley Rd, San Luis Obispo, CA 93401',
        name: "Roof Rescuers",
        description: 'Repair roofs.',
        vendor: {connect: Carl},
        type: {connect: Roofing},
        image:'../public/images/vendor/4.png'
    },
  })

  const Remover = await prisma.service.upsert({
    where: { id: 5 },
    update: {},
    create: {
        minPrice: 100,
        maxPrice: 1000,
        address: '1701 New Stine Rd, Bakersfield, CA 93309',
        name: "Pestt Remover's",
        description: 'Remove pests.',
        vendor: {connect: Abby},
        type: {connect: Pest_Control},
        image:'../public/images/vendor/5.png'
    },
  })

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })