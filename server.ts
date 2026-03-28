import express from 'express';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Helper for date validation
function validateDates(checkIn: string, checkOut: string) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  if (inDate < today) {
    return { valid: false, error: 'Check-in date cannot be in the past' };
  }
  if (outDate <= inDate) {
    return { valid: false, error: 'Check-out date must be after check-in date (no same-day check-out)' };
  }
  return { valid: true, inDate: inDate, outDate: outDate };
}

// Background job to expire pending bookings after 10 minutes
setInterval(async () => {
  try {
    const expiredBookings = await prisma.booking.updateMany({
      where: {
        status: 'pending',
        expiresAt: { lt: new Date() }
      },
      data: { status: 'cancelled' }
    });
    if (expiredBookings.count > 0) {
      console.log(`Expired ${expiredBookings.count} pending bookings.`);
    }
  } catch (error) {
    console.error('Failed to expire bookings:', error);
  }
}, 60 * 1000); // Run every minute

// API Routes
app.get('/api/hotel', async (req, res) => {
  try {
    const hotel = await prisma.hotel.findFirst();
    const rooms = await prisma.room.findMany();
    res.json({ hotel, rooms });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel data' });
  }
});

app.post('/api/availability', async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  
  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { valid, error, inDate, outDate } = validateDates(checkIn, checkOut);
  if (!valid) return res.status(400).json({ error });

  try {
    const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // Overlap logic: existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn
    const overlappingBookings = await prisma.booking.count({
      where: {
        roomId: Number(roomId),
        checkIn: { lt: outDate },
        checkOut: { gt: inDate },
        OR: [
          { status: 'confirmed' },
          { 
            status: 'pending', 
            expiresAt: { gt: new Date() } 
          }
        ]
      }
    });

    const isAvailable = overlappingBookings < room.totalRooms;
    res.json({ available: isAvailable, remaining: room.totalRooms - overlappingBookings });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { roomId, checkIn, checkOut, name, email, phone } = req.body;
  
  if (!roomId || !checkIn || !checkOut || !name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { valid, error, inDate, outDate } = validateDates(checkIn, checkOut);
  if (!valid) return res.status(400).json({ error });

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({ where: { id: Number(roomId) } });
      if (!room) throw new Error('Room not found');

      await tx.$queryRaw`SELECT * FROM "Room" WHERE id = ${Number(roomId)} FOR UPDATE`;

      const overlappingBookings = await tx.booking.count({
        where: {
          roomId: Number(roomId),
          checkIn: { lt: outDate },
          checkOut: { gt: inDate },
          OR: [
            { status: 'confirmed' },
            { status: 'pending', expiresAt: { gt: new Date() } }
          ]
        }
      });

      if (overlappingBookings >= room.totalRooms) {
        throw new Error('Room is no longer available for these dates');
      }

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      return await tx.booking.create({
        data: {
          roomId: Number(roomId),
          checkIn: inDate,
          checkOut: outDate,
          name,
          email,
          phone,
          status: 'pending',
          expiresAt
        }
      });
    });

    res.json({ booking });
  } catch (error: any) {
    console.error('Booking error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create booking';
    const status = message.includes('not found') || message.includes('no longer available') ? 400 : 500;
    res.status(status).json({ error: message });
  }
});

app.post('/api/bookings/:id/confirm', async (req, res) => {
  const { id } = req.params;
  
  try {
    const updated = await prisma.booking.updateMany({
      where: {
        id: Number(id),
        status: 'pending',
        expiresAt: { gt: new Date() }
      },
      data: { status: 'confirmed' }
    });

    if (updated.count === 0) {
      const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      if (booking.status === 'confirmed') return res.json({ success: true, booking });
      return res.status(400).json({ error: 'Booking has expired or been cancelled' });
    }

    const confirmedBooking = await prisma.booking.findUnique({ where: { id: Number(id) } });
    res.json({ success: true, booking: confirmedBooking });
  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});

app.post('/api/bookings/:id/cancel', async (req, res) => {
  const { id } = req.params;
  
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: 'cancelled' }
    });

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
