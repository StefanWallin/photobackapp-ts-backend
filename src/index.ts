// import app from './app';

import { write } from 'fs';
import { readServerConfig, writeServerConfig } from './config/serverconfig';

// app.listen(3000, () => {
//   console.log(`listening on http://localhost:3000`);
// });
const run = async () => {
  const config = await readServerConfig();
  console.log('Read server config:', config);
  await writeServerConfig(config);
};

run().then(console.log).catch(console.error);
