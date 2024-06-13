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
    where: { id: 6 },
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
      description: 'Our professional cleaning service ensures that every corner of your home or office is spotless. We offer a variety of cleaning options, including deep cleaning, carpet cleaning, and eco-friendly solutions. Our experienced team uses high-quality products and equipment to provide a thorough and efficient clean, leaving your space fresh and hygienic. Whether you need a one-time service or regular maintenance, we tailor our offerings to meet your specific needs and schedule.',
      vendor: { connect: Bob },
      type: { connect: Cleaning },
      image: '../public/images/vendor/1.png'
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
      description: 'Our expert plumbing services cover everything from routine maintenance to emergency repairs. We handle leaks, clogged drains, water heater issues, and more. Our licensed plumbers use the latest technology and techniques to diagnose and fix problems quickly, ensuring your plumbing system operates smoothly. With our reliable and professional service, you can trust that your home or business is in good hands. We are available 24/7 to address any plumbing emergencies that may arise.',
      vendor: { connect: Ben },
      type: { connect: Plumbing },
      image: '../public/images/vendor/2.png'
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
      description: 'Our lawn care services help you achieve a lush, healthy lawn that enhances the beauty of your property. We offer mowing, fertilization, weed control, aeration, and more to keep your lawn in top condition. Our knowledgeable team uses environmentally friendly practices and products to promote sustainable growth and maintain a vibrant landscape. Whether you need regular maintenance or a one-time treatment, we provide reliable and professional care tailored to your lawn unique needs.',
      vendor: { connect: Ben },
      type: { connect: Lawncare },
      image: '../public/images/vendor/3.png'
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
      description: 'Our roofing services provide comprehensive solutions for all your roofing needs, including installation, repair, and maintenance. We work with a variety of roofing materials, such as shingles, tiles, and metal, to ensure your roof is durable and aesthetically pleasing. Our skilled team conducts thorough inspections and offers detailed reports to help you make informed decisions. Whether you need a new roof or just a few repairs, our commitment to quality and customer satisfaction guarantees excellent results.',
      vendor: { connect: Carl },
      type: { connect: Roofing },
      image: '../public/images/vendor/4.png'
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
      description: 'Our pest control services protect your home or business from unwanted pests, including insects, rodents, and wildlife. We use safe and effective methods to eliminate infestations and prevent future occurrences. Our technicians are trained to identify and treat a wide range of pest problems, providing customized solutions to fit your specific situation. With regular inspections and preventative measures, we ensure a pest-free environment that is safe for your family, pets, and customers.',
      vendor: { connect: Abby },
      type: { connect: Pest_Control },
      image: '../public/images/vendor/5.png'
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