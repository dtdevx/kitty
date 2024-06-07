import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // Seed roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
    },
  });

  // Prepare passwords
  const userPassword = await bcrypt.hash('secret', 10);
  const adminPassword = await bcrypt.hash('supersecret', 10);

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
    },
  });

  // Seed user
  await prisma.user.create({
    data: {
      email: 'user@kitty.lan',
      name: 'Kitty User',
      password: userPassword,
      profilePic: 'https://kitty.lan/img/user-pic.png',
      isActive: true,
      roles: {
        create: [{ role: { connect: { id: userRole.id } } }],
      },
    },
  });

  // Seed admin
  await prisma.user.create({
    data: {
      email: 'admin@kitty.lan',
      name: 'Kitty Admin',
      password: adminPassword,
      profilePic: 'https://kitty.lan/img/admin-pic.png',
      isActive: true,
      roles: {
        create: [
          { role: { connect: { id: adminRole.id } } },
          { role: { connect: { id: userRole.id } } },
        ],
      },
    },
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
