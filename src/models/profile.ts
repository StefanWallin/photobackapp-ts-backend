import { Profile } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminExists = async (): Promise<boolean> => {
  const profiles = await prisma.profile.findMany({
    where: {
      admin: true,
    },
  });
  return profiles.length > 0;
};

export const findOrCreateProfile = async (
  name: Profile['name'],
  admin?: Profile['admin']
) => {
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
      admin: admin || false,
    },
  });
};
