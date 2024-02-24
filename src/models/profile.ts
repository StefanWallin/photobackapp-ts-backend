import { Profile } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findOrCreateProfile = async (name: Profile['name']) => {
  const profile = await prisma.profile.findFirst({
    where: {
      name,
    },
  });
  if (profile) {
    return profile;
  }
  return await prisma.profile.create({
    data: {
      name,
    },
  });
};
