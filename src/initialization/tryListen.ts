import express from 'express';
import http from 'http';

const app = express();

const POSSIBLE_PORTS: number[] = [5891, 5892, 5893, 5894, 5895, 5896] as const;

type Result = { status: 'success'; port: number } | { status: 'busy' };

const tryListenOnPort = async (port: number): Promise<Result> => {
  return new Promise((resolve) => {
    const server = http.createServer(app);

    server.on('error', (error) => {
      if (error && 'code' in error && error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy. Retrying on another port...`);
        resolve({ status: 'busy' });
      } else {
        console.error(`Error in tryListenOnPort: ${error.message}`);
        process.exit(1);
      }
    });

    server.listen(port, () => {
      resolve({ status: 'success', port });
      console.log(`Server is running on port ${port}`);
      server.close(() => {
        console.log(`Server on port ${port} closed`);
      });
    });
  });
};

export const tryListen = async () => {
  let remainingPorts = POSSIBLE_PORTS;
  while (remainingPorts.length > 0) {
    const attemptPort = remainingPorts[0];
    remainingPorts = remainingPorts.slice(1);
    try {
      const result = await tryListenOnPort(attemptPort);
      if (result.status === 'success') {
        return result.port;
      }
    } catch (error) {
      console.error('Error in tryListen: ', error);
      process.exit(1);
    }
  }
};
