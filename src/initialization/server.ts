import express, { Application } from 'express';
import http from 'http';
import { tryListen } from './tryListen';
import systemRouter from './routes/system';

const app = express();

type Result =
  | { status: 'success'; port: number; close: () => void }
  | { status: 'busy' };

export const setupServer = (): Promise<Result> => {
  return new Promise((resolve) => {
    tryListen()
      .then((port) => {
        const server = http.createServer(app);
        server.on('error', (error) => {
          console.error(`Error in server: ${error.message}`);
          process.exit(1);
        });
        app.use('/', systemRouter);
        server.listen(port, () => {
          resolve({
            status: 'success',
            port,
            close: server.close.bind(server),
          });
          console.log(`Server is running on port ${port}`);
        });
      })
      .catch((error) => {
        console.error('Error in tryListen: ', error);
        process.exit(1);
      });
  });
};
