import { logError } from '../util/logger';
import { readServerConfig, writeServerConfig } from './config';
import getConfigContext from '../contexts/ConfigContext';
import { checkDatabase } from './database';
import getLifeCycleContext from '../contexts/LifecycleContext';
import { checkPorts } from './ports';
import { setupServer } from './server';
import { setupMdns } from './mdns';
import { ensureAdminUser } from './user';

const checkDatabaseError = 'Database not correctly setup or corrupted';
const checkPortsError = 'No available ports to start server';
const setupServerError = 'Error setting up server';
const setupMDNSError = 'Error setting up mdns';

const throwError = (err: string) => {
  throw new Error(err);
};

export const runInitializers = async (libraryPath: string) => {
  try {
    const config = await readServerConfig(libraryPath);
    getConfigContext(config);
    getLifeCycleContext();
    (await checkDatabase()) || throwError(checkDatabaseError);
    (await checkPorts()) || throwError(checkPortsError);
    (await setupServer()) || throwError(setupServerError);
    (await setupMdns()) || throwError(setupMDNSError);
    (await ensureAdminUser()) || throwError('Error creating admin user');
    await writeServerConfig(libraryPath, config);
  } catch (error: unknown) {
    logError('Caught an uncaught error in server initialization', error);
  }

  // Start Koa server
  // Announce server on mdns
};
