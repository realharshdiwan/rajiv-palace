import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();

  // Create Hotel
  const hotel = await prisma.hotel.create({
    data: {
      name: 'Hotel Rajiv Palace',
      location: 'Chowk Bazaar Road, Sahibganj, Jharkhand',
      rating: 4.6,
      highlight: 'Near Railway Station, Main Market',
    },
  });

  console.log(`Created hotel: ${hotel.name}`);

  // Create Rooms
  await prisma.room.createMany({
    data: [
      {
        name: 'Standard Room',
        price: 1800,
        maxGuests: 3,
        description: 'A comfortable and clean room perfect for a short stay.',
        images: ['https://picsum.photos/seed/standard-room/800/600'],
        totalRooms: 5,
        size: '144 sq ft (13 sq m)',
        view: 'City View',
        bed: '1 Double Bed',
        amenities: ['Air Conditioning', 'WiFi', 'Mineral Water', 'Housekeeping', 'Laundry Service', 'Heater'],
      },
      {
        name: 'Deluxe Room',
        price: 2400,
        maxGuests: 3,
        description: 'Spacious room with elegant decor and mountain views.',
        images: ['https://picsum.photos/seed/deluxe-room/800/600'],
        totalRooms: 3,
        size: '240 sq ft (22 sq m)',
        view: 'Mountain View',
        bed: '1 King Bed',
        amenities: ['Air Conditioning', 'WiFi', 'Mineral Water', 'Housekeeping', 'Laundry Service', 'Study Area'],
      },
      {
        name: 'Suite Room',
        price: 3000,
        maxGuests: 3,
        description: 'Our most luxurious offering with premium amenities and expansive space.',
        images: ['https://picsum.photos/seed/suite-room/800/600'],
        totalRooms: 2,
        size: '260 sq ft (24 sq m)',
        view: 'Mountain View',
        bed: '1 King Bed',
        amenities: ['Air Conditioning', 'Mineral Water', 'Laundry Service', 'Heater', 'Study Area'],
      }
    ],
  });

  console.log(`Created rooms: Standard Room, Deluxe Room, Suite Room`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
