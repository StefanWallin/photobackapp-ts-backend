import { ServerConfig } from '../initialization/config';

let instance: ReturnType<typeof makeSingleton<ServerConfig>>;

/**
 * Singleton supplies accessors using Revealing Module
 * pattern and we use generics, since we could reuse
 * this across multiple singletons
 *
 * Note: Object.freeze() not required due to type narrowing!
 */
const makeSingleton = <T>(initial: T) => {
  /** Closure of the singleton's value to keep it private */
  let config: T = initial;
  /** Only the accessors are returned */
  return {
    getConfig: (): T => config,
    setConfig: (newConfig: T): void => {
      config = newConfig;
    },
  };
};

/**
 * Retrieves the only instance of the ConfigContext
 * and allows a once-only initialisation
 */
const getConfigContext = (initial?: ServerConfig) => {
  if (instance) {
    if (initial) {
      throw Error('ConfigContext already initialised');
    }
  } else {
    if (!initial) {
      throw Error('ConfigContext must be initialized with initial value');
    }
    instance = makeSingleton<ServerConfig>(initial);
  }
  return instance;
};

export default getConfigContext;
