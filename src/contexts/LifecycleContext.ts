import { logError, logInfo } from '../util/logger';

type LifeCycleHandlers = {
  mdnsOnError: (error: Error) => void;
  mdnsOnListening: () => void;
  mdnsOnClose: () => void;
  apiOnError: (error: Error) => void;
  apiOnListening: (port: number) => void;
  apiOnClose: () => void;
};

export type LifeCycle = {
  on: <T extends keyof LifeCycleHandlers>(
    event: T,
    handler: LifeCycleHandlers[T]
  ) => void;
  trigger: <T extends keyof LifeCycleHandlers>(
    event: T,
    ...args: Parameters<LifeCycleHandlers[T]>
  ) => void;
};
export type LifeCycleEvents = keyof LifeCycleHandlers;

let instance: ReturnType<typeof makeSingleton>;

const makeSingleton = () => {
  /** Closure of the singleton's value to keep it private */
  const mdnsOnErrorHandlers: Array<LifeCycleHandlers['mdnsOnError']> = [];
  const mdnsOnListeningHandlers: Array<LifeCycleHandlers['mdnsOnListening']> =
    [];
  const mdnsOnCloseHandlers: Array<LifeCycleHandlers['mdnsOnClose']> = [];
  const apiOnErrorHandlers: Array<LifeCycleHandlers['apiOnError']> = [];
  const apiOnListeningHandlers: Array<LifeCycleHandlers['apiOnListening']> = [];
  const apiOnCloseHandlers: Array<LifeCycleHandlers['apiOnClose']> = [];

  const lifeCycle: LifeCycle = {
    on: <T extends keyof LifeCycleHandlers>(
      event: T,
      handler: LifeCycleHandlers[T]
    ) => {
      logInfo(`Lifecycle event listener registered: "${event}" `);
      switch (event) {
        case 'mdnsOnError':
          mdnsOnErrorHandlers.push(handler as LifeCycleHandlers['mdnsOnError']);
          break;
        case 'mdnsOnListening':
          mdnsOnListeningHandlers.push(
            handler as LifeCycleHandlers['mdnsOnListening']
          );
          break;
        case 'mdnsOnClose':
          mdnsOnCloseHandlers.push(handler as LifeCycleHandlers['mdnsOnClose']);
          break;
        case 'apiOnError':
          apiOnErrorHandlers.push(handler as LifeCycleHandlers['apiOnError']);
          break;
        case 'apiOnListening':
          apiOnListeningHandlers.push(
            handler as LifeCycleHandlers['apiOnListening']
          );
          break;
        case 'apiOnClose':
          apiOnCloseHandlers.push(handler as LifeCycleHandlers['apiOnClose']);
          break;
        default:
          logError('Unhandled lifecycle event: ', event);
      }
    },
    trigger: <T extends keyof LifeCycleHandlers>(
      event: T,
      ...args: Parameters<LifeCycleHandlers[T]>
    ) => {
      logInfo(`Lifecycle event triggered: "${event}" `, JSON.stringify(args));
      switch (event) {
        case 'mdnsOnError': {
          mdnsOnErrorHandlers.forEach((handler) => {
            const [error] = args;
            handler(error instanceof Error ? error : new Error(String(error)));
          });
          if (mdnsOnErrorHandlers.length === 0) {
            const [error] = args;
            logError('Unhandled error in mdns: ', error);
          }
          break;
        }
        case 'mdnsOnListening':
          mdnsOnListeningHandlers.forEach((handler) => handler());
          break;
        case 'mdnsOnClose':
          mdnsOnCloseHandlers.forEach((handler) => handler());
          break;
        case 'apiOnError': {
          apiOnErrorHandlers.forEach((handler) => {
            const [error] = args;
            handler(error instanceof Error ? error : new Error(String(error)));
          });
          if (apiOnErrorHandlers.length === 0) {
            const [error] = args;
            logError('Unhandled error in api: ', error);
          }
          break;
        }
        case 'apiOnListening': {
          const [port] = args;
          if (typeof port !== 'number') {
            logError('Invalid port: ', port);
            return;
          }
          apiOnListeningHandlers.forEach((handler) => handler(port));
          break;
        }
        case 'apiOnClose':
          apiOnCloseHandlers.forEach((handler) => handler());
          break;
        default:
          logError('Unhandled lifecycle event: ', event);
      }
    },
  };

  /** Only the accessors are returned */
  return {
    on: lifeCycle.on,
    trigger: lifeCycle.trigger,
  };
};

/**
 * Retrieves the only instance of the ConfigContext
 * and allows a once-only initialisation
 */
const getLifeCycleContext = () => {
  if (!instance) {
    instance = makeSingleton();
  }
  return instance;
};

export default getLifeCycleContext;
