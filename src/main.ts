import { readServerConfig, writeServerConfig } from './config/serverconfig';

export const runPhotoBackApp = async (libraryPath: string) => {
  const config = await readServerConfig(libraryPath);
  // Check database file
  // Test possible ports
  await writeServerConfig(libraryPath, config);
  // Start Koa server
  // onReady, write config
};

// import app from './app';
// app.listen(3000, () => {
//   console.log(`listening on http://localhost:3000`);
// });
