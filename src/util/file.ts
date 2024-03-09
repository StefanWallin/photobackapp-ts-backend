import { promises as fsPromises, constants } from 'fs';
import { logError, logInfo, logWarn } from './logger';

export const writeFile = async (filename: string, data: string) => {
  return await fsPromises.writeFile(filename, data, {
    encoding: 'utf-8',
    flag: 'w',
  });
};

export const readFile = async (filename: string) => {
  try {
    return await fsPromises.readFile(filename, {
      encoding: 'utf-8',
    });
  } catch (error) {
    return '';
  }
};

/**
 * Checks if the directory exists and is writable
 *
 * ## Example usage
 * const filepath = '/path/to/your/directoryOrFile';
 * checkFilepath(filepath).then(isWritable => {
 *   if (isWritable) {
 *     console.log('The filepath exists and is readable and writable.');
 *   } else {
 *     console.log('The filepath is either non-existing, non-readable or non-writeable.');
 *   }
 * });
 *
 * @param fsPath A platform-specific file or directory path.
 * @returns true if the directory exists and is writable, false otherwise.
 */
export const checkFilepath = async (filepath: string) => {
  try {
    await fsPromises.access(filepath, constants.R_OK | constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
};

export const copyDefaultDb = async (
  targetPath: string,
  attempts = 1
): Promise<boolean> => {
  const sourcePath = './prisma/dev.db';
  const exists = await checkFilepath(targetPath);
  if (exists) {
    throw new Error('Target DB file already exists');
  }
  try {
    await fsPromises.copyFile(sourcePath, targetPath);
    logInfo('Copied devDb', `${sourcePath} => ${targetPath}`);
    return true;
  } catch (err: unknown) {
    if (attempts > 3) {
      logError('Failed to copy devDb', err);
      return false;
    }
    logWarn(
      'Failed to copy devDb, retrying #' + attempts,
      `${sourcePath} => ${targetPath}`
    );
    return copyDefaultDb(targetPath, attempts + 1);
  }
};
