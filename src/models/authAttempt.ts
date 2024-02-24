import { Profile } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { safeId } from '../util/safeId';

const prisma = new PrismaClient();

export const createAuthAttempt = async (profile: Profile) => {
  const now = Date.now();
  await prisma.authAttempt.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(now),
      },
      profileId: profile.id,
    },
  });
  const authAttempt = await prisma.authAttempt.findFirst({
    where: {
      expiresAt: {
        gt: new Date(now),
      },
      profileId: profile.id,
    },
  });

  if (authAttempt) {
    return authAttempt;
  }
  await prisma.authAttempt.deleteMany({
    where: {
      profileId: profile.id,
    },
  });
  return await prisma.authAttempt.create({
    data: {
      secret: safeId(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 3),
      profile: {
        connect: {
          id: profile.id,
        },
      },
    },
  });
};
