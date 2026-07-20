const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  try {
    const hostels = await p.hostel.findMany();
    console.log('COUNT:', hostels.length);
    hostels.forEach(h => console.log('  -', h.id, '|', h.hostelName, '|', h.hostelType, '|', h.gender, '|', h.capacity, '| wardenId:', h.wardenId));
    await p.$disconnect();
  } catch (e) {
    console.error('Error:', e.message, e.stack);
    await p.$disconnect();
  }
})();
