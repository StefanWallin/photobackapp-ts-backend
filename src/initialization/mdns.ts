import mdns from 'mdns';

import getConfigContext from '../contexts/ConfigContext';
import getLifeCycleContext from '../contexts/LifecycleContext';
import { log } from 'console';
import { logInfo } from '../util/logger';

export const setupMdns = async () => {
  const LifecycleContext = getLifeCycleContext();
  const confContext = getConfigContext();
  const config = confContext.getConfig();
  const name = serverName();
  logInfo('Publishing bonjour service', `${name} on port ${config.port}`);
  const ad = mdns.createAdvertisement(mdns.tcp('photobackapp'), config.port, {
    name,
  });
  LifecycleContext.on('apiOnClose', () => {
    logInfo('Stopping bonjour service');
    ad.stop();
  });
  ad.start();
  return true;
};

const serverName = () => {
  const confContext = getConfigContext();
  const { serverId, name, hostname } = confContext.getConfig();
  return `${serverId}-${name} on ${hostname}`;
};
