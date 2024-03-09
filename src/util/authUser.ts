import enquirer from 'enquirer';
import qrcode from 'qrcode-terminal';

import { findOrCreateProfile } from '../models/profile';
import { createAuthAttempt } from '../models/authAttempt';
import { logInfo } from './logger';

export const createAdminUser = async (admin = false) => {
  const { username } = await enquirer.prompt<{ username: string }>({
    type: 'input',
    name: 'username',
    message: 'Hey! What are you called?',
  });
  const name = username.trim();
  logInfo('Creating profile for ', name);
  const profile = await findOrCreateProfile(name, admin);
  logInfo('Profile created');
  const authAttempt = await createAuthAttempt(profile);
  logInfo('Auth attempt created with secret: ', authAttempt.secret);
  qrcode.generate(authAttempt.secret, { small: true });
  // TODO, AWAIT APP-AUTHENTICATION
  return true;
};
