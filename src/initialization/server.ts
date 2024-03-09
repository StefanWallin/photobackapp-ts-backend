import getConfigContext from '../contexts/ConfigContext';
import { logError, logInfo } from '../util/logger';
import getLifeCycleContext from '../contexts/LifecycleContext';
import { createServer } from '../app';

const app = createServer();

export const setupServer = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const lifecycleContext = getLifeCycleContext();
    const confContext = getConfigContext();
    const { port } = confContext.getConfig();
    const server = app.listen(port);
    let resolved = false;
    server.on('error', (error) => {
      logError(
        'Error starting api server: ',
        error,
        JSON.stringify({ port }, null, 2)
      );
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
      lifecycleContext.trigger('apiOnError', error);
    });
    server.on('listening', () => {
      if (!resolved) {
        resolved = true;
        resolve(true);
      }
      lifecycleContext.trigger('apiOnListening', port);
    });
    server.on('close', () => {
      logInfo('API server closed');
      lifecycleContext.trigger('apiOnClose');
    });
  });
};
