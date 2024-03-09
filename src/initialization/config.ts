import { z } from 'zod';
import path from 'path';
import os from 'node:os';

import { safeId } from '../util/safeId';
import { readFile, writeFile } from '../util/file';
import { logError, logInfo, logWarn } from '../util/logger';
import { AllowedPorts, ServerConfigFilePath } from '../config/config';

export type ServerConfig = {
  libraryPath?: string;
  hostname: string;
  port: number;
  name: string;
  serverId: string;
};

const hostname = () => {
  return os.hostname().replace('.local', '');
};

export const ServerConfigZodSchema = z.object({
  libraryPath: z.string().optional(),
  hostname: z.string().default(hostname()),
  port: z
    .number()
    .refine((arg: number) => {
      return AllowedPorts.includes(arg);
    })
    .default(AllowedPorts[0]),
  name: z.string().default('PhotoBackAppServer'),
  serverId: z.string().default(safeId()),
});

const filePath = (libraryPath: string) =>
  [libraryPath, ...ServerConfigFilePath].join(path.sep);

export const readServerConfig = async (libraryPath: string) => {
  const path = filePath(libraryPath);
  try {
    logInfo('Reading server config: ', path);
    const fileContents = await readFile(path);
    const parsedContents = JSON.parse(fileContents);
    const config = await ServerConfigZodSchema.parse({
      libraryPath,
      ...parsedContents,
    });
    return config satisfies ServerConfig;
  } catch (error) {
    logError('Error reading server config: ', error);
    logWarn('Generating new server config: ', path);
    const config = ServerConfigZodSchema.parse({ libraryPath });
    return config satisfies ServerConfig;
  }
};

export const writeServerConfig = async (
  libraryPath: string,
  config: ServerConfig
) => {
  try {
    const filePath = [libraryPath, ...ServerConfigFilePath].join(path.sep);
    logInfo('Writing server config: ', filePath);
    await writeFile(filePath, JSON.stringify(config, null, 2));
  } catch (error) {
    logError(
      'Error writing server config: ',
      error,
      `Config was: ${JSON.stringify(config, null, 2)}`
    );
  }
};
