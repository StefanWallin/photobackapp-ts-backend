import Koa from 'koa';

import getConfigContext from '../contexts/ConfigContext';
import { logError, logInfo } from '../util/logger';
import { AllowedPorts } from '../config/config';

export const checkPorts = async () => {
  const confContext = getConfigContext();
  const config = confContext.getConfig();
  // deduplicate portsRemaining values:
  let portsRemaining = Array.from(new Set([config.port, ...AllowedPorts]));
  while (portsRemaining.length > 0) {
    const portToTry = portsRemaining[0];
    logInfo('Checking port: ', String(portToTry));
    portsRemaining = portsRemaining.slice(1);
    const result = await checkPort(portToTry);
    if (result) {
      confContext.setConfig({ ...config, port: portToTry });
      return result;
    }
  }
  return false;
};
export const checkPort = async (port: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const app = new Koa();
    const controller = new AbortController();
    const handle = setTimeout(() => {
      controller.abort();
      resolve(true);
    }, 200);
    try {
      const server = app.listen({
        port,
        signal: controller.signal,
      });
      server.on('error', (error) => {
        clearTimeout(handle);
        if (error && 'code' in error && error.code === 'EADDRINUSE') {
          logInfo(`Port ${port} is busy. Retrying on another port...`);
          resolve(false);
        } else {
          logError('Unexpected error in tryListen: ', error, String(port));
          reject(error);
        }
      });
    } catch (error: unknown) {
      logError('Caught unexpected error in tryListen: ', error);
      reject(error);
    }
  });
};
