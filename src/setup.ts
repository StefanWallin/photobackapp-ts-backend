import enquirer from 'enquirer';
import colors from 'colors/safe';
import qrcode from 'qrcode-terminal';

import { findOrCreateProfile } from './models/profile';
import { createAuthAttempt } from './models/authAttempt';

// import { safeId } from './util/safeId';
// import Bonjour from 'bonjour-service';
// const serverId = safeId();
// const instance = new Bonjour();
// // advertise an HTTP server on port 3000
// instance.publish({
//   name: 'My Web Server - ' + serverId,
//   type: 'photobackapp',
//   port: 3000,
// });

const setup = async () => {
  const { username } = await enquirer.prompt<{ username: string }>({
    type: 'input',
    name: 'username',
    message: 'Hey! What are you called?',
  });
  const name = username.trim();
  console.log(colors.cyan('Creating profile for ' + name));
  const profile = await findOrCreateProfile(name);
  console.log('Profile created: ', profile);
  const authAttempt = await createAuthAttempt(profile);
  console.log('Auth attempt created', authAttempt);
  qrcode.generate(authAttempt.secret, { small: true });
};

setup()
  .then(() => {
    console.log(colors.green('Setup complete'));
  })
  .catch((error) => {
    console.error(colors.red(error));
  });
