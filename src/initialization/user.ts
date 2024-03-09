import { adminExists } from '../models/profile';
import { createAdminUser } from '../util/authUser';
import { logInfo } from '../util/logger';

export const ensureAdminUser = async () => {
  const adminProfileExists = await adminExists();
  if (adminProfileExists) {
    logInfo('Admin user already exists');
    return true;
  } else {
    logInfo('Admin user does not exist, we need to create one.');
    return createAdminUser(true);
  }
};
