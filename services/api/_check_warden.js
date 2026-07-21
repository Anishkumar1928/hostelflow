const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const building = await prisma.building.findFirst({ where: { name: 'A-Block' } });
  console.log('building.name:', building?.name);
  console.log('building.wardenId:', building?.wardenId);
  console.log('building.hostelId:', building?.hostelId);
  if (building?.wardenId === null) console.log('wardenId IS NULL');
  if (building?.wardenId) console.log('wardenId length:', building.wardenId.length);
  await prisma.$disconnect();
}
main();
