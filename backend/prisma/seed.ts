import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

(async () => {
  await prisma.user.create({
    data: {
      fullName: 'Test Test',
      email: 'email@email.com',
      password: await bcrypt.hash('passwordpassword', await bcrypt.genSalt()),
      isVerified: true,
      avatarUrl: '',
      updatedAt: null,
    },
  });

  await prisma.user.create({
    data: {
      fullName: 'Test1 Test1',
      email: 'email1@email.com',
      password: await bcrypt.hash('passwordpassword', await bcrypt.genSalt()),
      isVerified: true,
      avatarUrl: '',
      updatedAt: null,
    },
  });
})();
