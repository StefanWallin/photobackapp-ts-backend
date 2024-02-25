import { promises as fsPromises } from 'fs';
import { join } from 'path';

export const writeFile = async (filename: string, data: string) => {
  const cwd = process.cwd();
  return await fsPromises.writeFile(join(cwd, filename), data, {
    encoding: 'utf-8',
    flag: 'w',
  });
};

export const readFile = async (filename: string) => {
  const cwd = process.cwd();
  return await fsPromises.readFile(join(cwd, filename), {
    encoding: 'utf-8',
  });
};
