import { z } from 'zod';
import colors from 'colors/safe';
import path from 'path';

import { safeId } from '../util/safeId';
import { checkFilepath, readFile, writeFile } from '../util/file';

const ServerConfigFilePath = ['.photobackapp.config'];

export type ServerConfig = {
  libraryPath?: string;
  hostname: string;
  port: number;
  name: string;
  serverId: string;
};

export const AllowedPorts = [5891, 5892, 5893, 5894, 5895, 5896];

export const ServerConfigZodSchema = z.object({
  libraryPath: z.string().optional(),
  hostname: z.string().default('localhost'),
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
    console.log(colors.cyan(' --> Reading server config: '), colors.dim(path));
    const fileContents = await readFile(path);
    const parsedContents = JSON.parse(fileContents);
    const config = await ServerConfigZodSchema.parse(parsedContents);
    return config satisfies ServerConfig;
  } catch (error) {
    console.warn(
      colors.yellow(' -!- Generating new server config: '),
      colors.dim(path)
    );
    const config = ServerConfigZodSchema.parse({ libraryPath });
    return config satisfies ServerConfig;
  }
};

export const writeServerConfig = async (
  libraryPath: string,
  config: ServerConfig
) => {
  const filePath = [libraryPath, ...ServerConfigFilePath].join(path.sep);
  console.log(
    colors.cyan(' --> Writing server config: '),
    colors.dim(filePath)
  );
  await writeFile(filePath, JSON.stringify(config, null, 2));
};
