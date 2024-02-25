import { z } from 'zod';
import { safeId } from '../util/safeId';
import { readFile, writeFile } from '../util/file';
import path from 'path';

const ServerConfigFilePath = ['src', 'config', 'serverconfig.json'];

export type ServerConfig = {
  hostname: string;
  port: number;
  name: string;
  serverId: string;
};

export const AllowedPorts = [5891, 5892, 5893, 5894, 5895, 5896];

export const ServerConfigZodSchema = z.object({
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

export const readServerConfig = async () => {
  try {
    const fileContents = await readFile(ServerConfigFilePath.join(path.sep));
    const config = await ServerConfigZodSchema.parse(JSON.parse(fileContents));
    return config as ServerConfig;
  } catch (error) {
    console.error('Error reading server config file', error);
    const config = ServerConfigZodSchema.parse({});
    return config as ServerConfig;
  }
};

export const writeServerConfig = async (config: ServerConfig) => {
  await writeFile(
    ServerConfigFilePath.join(path.sep),
    JSON.stringify(config, null, 2)
  );
};
