import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  console.log('Creating admin user...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@planetkids.com' },
      update: {},
      create: {
        email: 'admin@planetkids.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('   Email: admin@planetkids.com');
    console.log('   Password: admin123');
    console.log('\nYou can now login at: http://localhost:3000/admin/login\n');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
