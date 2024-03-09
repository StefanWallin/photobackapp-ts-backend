import { PrismaClient } from '@prisma/client';
import { sep } from 'path';

import getConfigContext from '../contexts/ConfigContext';
import { checkFilepath, copyDefaultDb } from '../util/file';
import { logError, logInfo } from '../util/logger';
import { ServerDatabaseFilePath } from '../config/config';

export const checkDatabase = async () => {
  try {
    const { libraryPath } = getConfigContext().getConfig();
    const dbPath = [libraryPath, ...ServerDatabaseFilePath].join(sep);
    logInfo('Checking database in selected library: ', dbPath);
    const dbFileExists = await checkFilepath(dbPath);
    if (!dbFileExists) {
      logInfo('Copying default database', dbPath);
      const copyResult = await copyDefaultDb(dbPath);
      if (!copyResult) {
        logError('Failed copying default database to: ', dbPath);
        return false;
      }
    }

    const prisma = new PrismaClient({
      datasourceUrl: `file:${dbPath}`,
    });
    return prisma && (await checkMigrations(prisma));
  } catch (error) {
    logError('Error checking database at startup', error);
    return false;
  }
};

async function checkMigrations(prisma: PrismaClient) {
  try {
    await prisma.$queryRaw`SELECT * FROM _prisma_migrations`;
    return true;
  } catch (error) {
    console.error('Error checking migrations: ', error);
    return false;
  }
}
