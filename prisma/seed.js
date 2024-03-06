const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const Venue = await prisma.type.upsert({
    where: { id: 1 },
    update: {},
    create: {
        name: "Venue"
    },
  })

  const Entertainment = await prisma.type.upsert({
    where: { id: 2 },
    update: {},
    create: {
        name: "Entertainment"
    },
  })

  const Catering = await prisma.type.upsert({
    where: { id: 3 },
    update: {},
    create: {
        name: "Catering"
    },
  })

  const Production = await prisma.type.upsert({
    where: { id: 4 },
    update: {},
    create: {
        name: "Production"
    },
  })

  const Decoration = await prisma.type.upsert({
    where: { id: 5 },
    update: {},
    create: {
        name: "Decoration"
    },
  })

  console.log({ Venue, Entertainment, Catering, Production, Decoration})
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